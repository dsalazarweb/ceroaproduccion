import type { APIRoute } from "astro";

const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;
const TURNSTILE_SECRET_KEY = import.meta.env.TURNSTILE_SECRET_KEY;
const CONTACT_EMAIL = "hola@ceroaproduccion.dev";

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret: TURNSTILE_SECRET_KEY, response: token, remoteip: ip }),
  });
  const data = await res.json();
  return data.success === true;
}

export const POST: APIRoute = async ({ request }) => {
  let body: { name?: string; email?: string; message?: string; turnstileToken?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Body inválido" }), {
      status: 400, headers: { "Content-Type": "application/json" },
    });
  }

  const { name, email, message, turnstileToken } = body;

  if (!name || !email || !message || !turnstileToken) {
    return new Response(JSON.stringify({ error: "Todos los campos son requeridos" }), {
      status: 400, headers: { "Content-Type": "application/json" },
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return new Response(JSON.stringify({ error: "Email no válido" }), {
      status: 400, headers: { "Content-Type": "application/json" },
    });
  }

  if (message.trim().length < 10) {
    return new Response(JSON.stringify({ error: "El mensaje es demasiado corto" }), {
      status: 400, headers: { "Content-Type": "application/json" },
    });
  }

  const ip = request.headers.get("CF-Connecting-IP") ?? "";
  const turnstileOk = await verifyTurnstile(turnstileToken, ip);
  if (!turnstileOk) {
    return new Response(JSON.stringify({ error: "Verificación de seguridad fallida" }), {
      status: 403, headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: `Formulario ceroaproduccion.dev <${CONTACT_EMAIL}>`,
        to: [CONTACT_EMAIL],
        reply_to: email,
        subject: `Nuevo mensaje de ${name}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
            <h2 style="color:#1a1a1a;border-bottom:2px solid #e5e5e5;padding-bottom:12px;">
              Nuevo mensaje desde ceroaproduccion.dev
            </h2>
            <table style="width:100%;margin-top:16px;">
              <tr>
                <td style="padding:8px 0;font-weight:bold;color:#555;width:80px;">Nombre:</td>
                <td style="padding:8px 0;">${name}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;font-weight:bold;color:#555;">Email:</td>
                <td style="padding:8px 0;"><a href="mailto:${email}">${email}</a></td>
              </tr>
            </table>
            <div style="margin-top:24px;padding:16px;background:#f5f5f5;border-radius:8px;border-left:4px solid #2337ff;">
              <p style="margin:0;font-weight:bold;color:#555;margin-bottom:8px;">Mensaje:</p>
              <p style="margin:0;line-height:1.6;white-space:pre-wrap;">${message}</p>
            </div>
            <p style="margin-top:24px;font-size:12px;color:#999;">
              Enviado desde ceroaproduccion.dev
            </p>
          </div>
        `,
      }),
    });

    if (resendRes.status === 200 || resendRes.status === 201) {
      return new Response(JSON.stringify({ success: true, message: "Mensaje enviado. Te responderé pronto." }), {
        status: 200, headers: { "Content-Type": "application/json" },
      });
    }

    const errorData = await resendRes.json();
    console.error("[contact] Resend error:", errorData);
    return new Response(JSON.stringify({ error: "No se pudo enviar el mensaje" }), {
      status: 500, headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[contact] Error inesperado:", err);
    return new Response(JSON.stringify({ error: "Error interno del servidor" }), {
      status: 500, headers: { "Content-Type": "application/json" },
    });
  }
};
