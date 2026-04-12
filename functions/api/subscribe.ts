interface Env {
  RESEND_API_KEY: string;
  TURNSTILE_SECRET_KEY: string;
  AUTH_SECRET: string; // Nueva clave para firmar tokens
}

const CONTACT_EMAIL = "hola@ceroaproduccion.dev";

// Genera un token firmado usando Web Crypto API (nativo en Cloudflare Workers)
async function generateToken(email: string, secret: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  
  const expires = Date.now() + 1000 * 60 * 60 * 24; // Expira en 24 horas
  const data = `${email}|${expires}`;
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  
  // Convertir firma a hex
  const hashArray = Array.from(new Uint8Array(signature));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  // Retornar en base64 seguro para URL
  return btoa(`${data}|${hashHex}`).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const headers = { "Content-Type": "application/json" };
  const origin = new URL(request.url).origin;

  let body: { email?: string; turnstileToken?: string };
  try {
    body = await request.json() as { email?: string; turnstileToken?: string };
  } catch {
    return new Response(JSON.stringify({ error: "Datos inválidos" }), { status: 400, headers });
  }

  const { email, turnstileToken } = body;

  if (!email || !turnstileToken) {
    return new Response(JSON.stringify({ error: "Email y validación requeridos" }), { status: 400, headers });
  }

  // 1. Verificación de Turnstile
  const ip = request.headers.get("CF-Connecting-IP") ?? "";
  try {
    const turnstileRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({
        secret: env.TURNSTILE_SECRET_KEY,
        response: turnstileToken,
        remoteip: ip
      })
    });
    const turnstileData = await turnstileRes.json() as { success: boolean };
    if (!turnstileData.success) {
      return new Response(JSON.stringify({ error: "Verificación de seguridad fallida" }), { status: 403, headers });
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: "Error en el servicio de seguridad" }), { status: 500, headers });
  }

  // 2. Generar Token y Enlace
  const token = await generateToken(email, env.AUTH_SECRET);
  const confirmationLink = `${origin}/api/confirm?token=${token}`;

  // 3. Enviar Correo de Confirmación
  try {
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: `Cero a Producción <${CONTACT_EMAIL}>`,
        to: [email],
        subject: "Confirma tu suscripción a Cero a Producción",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #333; line-height: 1.6; border: 1px solid #eee; border-radius: 12px; background-color: #fff;">
            <h2 style="color: #2337ff; margin-bottom: 24px; font-size: 24px;">¡Casi estás dentro! 🚀</h2>
            <p>Gracias por querer sumarte a <strong>Cero a Producción</strong>. Para asegurar que este es tu correo y que quieres recibir nuestras guías de DevOps, por favor confirma tu suscripción:</p>
            
            <div style="margin: 32px 0; text-align: center;">
              <a href="${confirmationLink}" style="background-color: #2337ff; color: #ffffff !important; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                Confirmar mi suscripción
              </a>
            </div>

            <p style="font-size: 0.9em; color: #666;">Si no solicitaste esto, puedes ignorar este correo. El enlace expirará en 24 horas.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="font-size: 0.8em; color: #999; text-align: center;">
              Cero a Producción — De Operaciones a Infraestructura Cloud<br>
              <a href="https://ceroaproduccion.dev" style="color: #999; text-decoration: none;">ceroaproduccion.dev</a>
            </p>
          </div>
        `,
      }),
    });

    if (resendRes.ok) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: "Te hemos enviado un correo de confirmación. Revisa tu bandeja de entrada." 
      }), { status: 200, headers });
    }

    return new Response(JSON.stringify({ error: "No se pudo enviar el correo de confirmación" }), { status: 500, headers });

  } catch (err) {
    return new Response(JSON.stringify({ error: "Error de comunicación con el servidor" }), { status: 500, headers });
  }
};
