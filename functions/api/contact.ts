function escapeHtml(str: string): string {
  if (!str) return "";
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export const onRequestPost: PagesFunction<{
  RESEND_API_KEY: string;
  TURNSTILE_SECRET_KEY: string;
  CONTACT_DEST_EMAIL: string;
}> = async ({ request, env }) => {
  try {
    const { name, email, message, turnstileToken } = await request.json() as {
      name: string;
      email: string;
      message: string;
      turnstileToken?: string;
    };

    // 1. Validaciones básicas
    if (!name || !email || !message || !turnstileToken) {
      return new Response(JSON.stringify({ error: 'Todos los campos y verificación de seguridad son obligatorios' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 2. Verificación de Turnstile
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
        return new Response(JSON.stringify({ error: "Verificación de seguridad fallida" }), { status: 403, headers: { 'Content-Type': 'application/json' } });
      }
    } catch (err) {
      return new Response(JSON.stringify({ error: "Error devuelto por el servicio de seguridad" }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message);

    // 3. Enviar email a TU bandeja usando Resend
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Contacto <contacto@ceroaproduccion.dev>',
        to: env.CONTACT_DEST_EMAIL,
        subject: `Nuevo mensaje de ${safeName} via ceroaproduccion.dev`,
        reply_to: email,
        html: `
          <h2>Nuevo mensaje de contacto</h2>
          <p><strong>Nombre:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Mensaje:</strong></p>
          <div style="background: #f4f4f4; padding: 15px; border-radius: 8px;">
            ${safeMessage.replace(/\n/g, '<br>')}
          </div>
        `
      })
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(JSON.stringify(error));
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: 'Error al enviar el mensaje' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
