interface Env {
  RESEND_API_KEY: string;
  TURNSTILE_SECRET_KEY: string;
  AUTH_SECRET: string;
}

const CONTACT_EMAIL = "hola@ceroaproduccion.dev";
const NOREPLY_EMAIL = "noreply@ceroaproduccion.dev";

async function generateToken(email: string, secret: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  
  const expires = Date.now() + 1000 * 60 * 60 * 24; // 24 horas
  const data = `${email}|${expires}`;
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  const hashArray = Array.from(new Uint8Array(signature));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
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

  const token = await generateToken(email, env.AUTH_SECRET);
  const confirmationLink = `${origin}/api/confirm?token=${token}`;

  try {
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: `Cero a Producción <${NOREPLY_EMAIL}>`,
        reply_to: 'contacto@ceroaproduccion.dev',
        to: [email],
        subject: "Confirma tu suscripción a Cero a Producción",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; background-color: #f8f8f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td align="center" style="padding: 40px 20px;">
                  <table width="100%" max-width="600" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e8e8e4; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                    <tr>
                      <td style="padding: 40px; text-align: center; background-color: #ffffff;">
                        <div style="margin-bottom: 24px;">
                          <span style="font-size: 48px;">🚀</span>
                        </div>
                        <h1 style="margin: 0 0 16px 0; color: #0f1219; font-size: 28px; font-weight: 700; line-height: 1.2;">¡Casi estás dentro!</h1>
                        <p style="margin: 0 0 32px 0; color: #60739f; font-size: 18px; line-height: 1.6;">
                          Gracias por querer sumarte a <strong>Cero a Producción</strong>. Por favor, confirma tu correo para empezar a recibir las bitácoras y guías de DevOps.
                        </p>
                        <a href="${confirmationLink}" style="display: inline-block; padding: 16px 32px; background-color: #2337ff; color: #ffffff !important; text-decoration: none; border-radius: 8px; font-size: 18px; font-weight: 600; transition: background-color 0.2s ease;">
                          Confirmar mi suscripción
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 24px 40px; background-color: #f8f8f6; border-top: 1px solid #e8e8e4; text-align: center;">
                        <p style="margin: 0 0 8px 0; color: #888; font-size: 14px;"><strong>Nota:</strong> Esta es una cuenta de envío automático. Si respondes a este correo, nos llegará a nuestra bandeja de contacto.</p>
                        <p style="margin: 0 0 8px 0; color: #888; font-size: 14px;">Si no solicitaste esto, puedes ignorar este correo.</p>
                        <p style="margin: 0; color: #888; font-size: 14px;">
                          &copy; ${new Date().getFullYear()} <a href="https://ceroaproduccion.dev" style="color: #888; text-decoration: underline;">ceroaproduccion.dev</a>
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
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
