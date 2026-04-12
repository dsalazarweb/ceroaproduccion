interface Env {
  RESEND_API_KEY: string;
  RESEND_AUDIENCE_ID: string;
  TURNSTILE_SECRET_KEY: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const headers = { "Content-Type": "application/json" };

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

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return new Response(JSON.stringify({ error: "El email no parece válido" }), { status: 400, headers });
  }

  // Verificación de Turnstile
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

  // Añadir a Resend
  try {
    const resendRes = await fetch(
      `https://api.resend.com/audiences/${env.RESEND_AUDIENCE_ID}/contacts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({ email, unsubscribed: false }),
      }
    );

    if (resendRes.status === 200 || resendRes.status === 201) {
      return new Response(JSON.stringify({ success: true, message: "¡Suscripción exitosa!" }), { status: 200, headers });
    }

    const errorData = await resendRes.json() as { message?: string };
    // Si ya existe, lo tratamos como éxito para el usuario
    if (JSON.stringify(errorData).includes("already_exists")) {
      return new Response(JSON.stringify({ success: true, message: "Ya estás en nuestra lista." }), { status: 200, headers });
    }

    return new Response(JSON.stringify({ error: "No se pudo completar la suscripción" }), { status: 500, headers });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Error de conexión con el servicio de correo" }), { status: 500, headers });
  }
};
