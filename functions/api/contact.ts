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

    // 3. Enviar emails en lote usando Resend (Batch API)
    const res = await fetch('https://api.resend.com/emails/batch', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([
        // Correo para ti (Administrador)
        {
          from: 'Mensajero <noreply@ceroaproduccion.dev>', // Para que se diferencie en tu bandeja
          to: env.CONTACT_DEST_EMAIL,
          subject: `Tu mensaje en ceroaproduccion.dev - ${safeName}`,
          reply_to: email, // Para que puedas darle a "Responder" directo
          html: `
            <h2>Nuevo mensaje de contacto</h2>
            <p><strong>Nombre:</strong> ${safeName}</p>
            <p><strong>Email:</strong> ${safeEmail}</p>
            <p><strong>Mensaje:</strong></p>
            <div style="background: #f4f4f4; padding: 15px; border-radius: 8px;">
              ${safeMessage.replace(/\n/g, '<br>')}
            </div>
          `
        },
        // Correo de confirmación automático para el usuario
        {
          from: 'Diego / Cero a Producción <hola@ceroaproduccion.dev>',
          to: email,
          subject: `He recibido tu mensaje, ${safeName} 👋`,
          reply_to: 'contacto@ceroaproduccion.dev', // Si responden a esto, te llegará a contacto@
          html: `
            <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #2337ff;">¡Hola, ${safeName}!</h2>
              <p>Te escribo para confirmarte que he recibido tu mensaje correctamente a través de <strong>ceroaproduccion.dev</strong>.</p>
              <p>Trataré de responderte a la mayor brevedad posible.</p>
              
              <div style="background: #f8f8f6; padding: 20px; border-left: 4px solid #2337ff; border-radius: 0 8px 8px 0; margin: 30px 0;">
                <p style="margin-top: 0; font-size: 0.9em; color: #666; text-transform: uppercase;">Resumen de tu mensaje:</p>
                <p style="margin-bottom: 0;"><em>"${safeMessage.replace(/\n/g, '<br>')}"</em></p>
              </div>
              
              <p>Mientras tanto, te invito a echarle un vistazo a los <a href="https://ceroaproduccion.dev/labs" style="color: #2337ff; font-weight: bold;">últimos Labs y Guias DevOps del blog</a>, ¡quizás haya algo nuevo desde tu última visita!</p>
              <br>
              <p>Un abrazo,<br><strong>Diego Salazar</strong></p>
            </div>
          `
        }
      ])
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
