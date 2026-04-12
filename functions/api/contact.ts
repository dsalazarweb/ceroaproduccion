interface Env {
  RESEND_API_KEY: string;
  TURNSTILE_SECRET_KEY: string;
}

const CONTACT_EMAIL = "hola@ceroaproduccion.dev";

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const headers = { "Content-Type": "application/json" };

  let body: { name?: string; email?: string; message?: string; turnstileToken?: string };
  try {
    body = await request.json() as { name?: string; email?: string; message?: string; turnstileToken?: string };
  } catch {
    return new Response(JSON.stringify({ error: "Body inválido" }), { status: 400, headers });
  }

  const { name, email, message, turnstileToken } = body;

  if (!name || !email || !message || !turnstileToken) {
    return new Response(JSON.stringify({ error: "Todos los campos son requeridos" }), { status: 400, headers });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return new Response(JSON.stringify({ error: "Email no válido" }), { status: 400, headers });
  }

  if (message.trim().length < 10) {
    return new Response(JSON.stringify({ error: "Mensaje demasiado corto" }), { status: 400, headers });
  }

  const ip = request.headers.get("CF-Connecting-IP") ?? "";
  const turnstileRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: new URLSearchParams({
      secret: env.TURNSTILE_SECRET_KEY,
      response: turnstileToken,
      remoteip: ip
    })
  });

  const turnstileData = await turnstileRes.json() as { success: boolean; "error-codes"?: string[] };
  
  if (!turnstileData.success) {
    const errorMsg = turnstileData["error-codes"]?.join(", ") || "token-invalido";
    return new Response(JSON.stringify({ 
      error: `Verificación fallida: ${errorMsg}`,
      debug: { hasSecret: !!env.TURNSTILE_SECRET_KEY }
    }), { status: 403, headers });
  }

  try {
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: `Formulario ceroaproduccion.dev <${CONTACT_EMAIL}>`,
        to: [CONTACT_EMAIL],
        reply_to: email,
        subject: `Nuevo mensaje de ${name}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
            <h2 style="border-bottom:2px solid #e5e5e5;padding-bottom:12px;">
              Nuevo mensaje desde ceroaproduccion.dev
            </h2>
            <p><strong>Nombre:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <div style="padding:16px;background:#f5f5f5;border-radius:8px;border-left:4px solid #2337ff;margin-top:16px;">
              <p style="margin:0;white-space:pre-wrap;">${message}</p>
            </div>
          </div>
        `,
      }),
    });

    if (resendRes.status === 200 || resendRes.status === 201) {
      return new Response(JSON.stringify({ success: true, message: "Mensaje enviado." }), { status: 200, headers });
    }

    const errorData = await resendRes.json();
    console.error("[contact] Resend error:", errorData);
    return new Response(JSON.stringify({ error: "No se pudo enviar el mensaje" }), { status: 500, headers });
  } catch (err) {
    console.error("[contact] Error:", err);
    return new Response(JSON.stringify({ error: "Error interno" }), { status: 500, headers });
  }
};
