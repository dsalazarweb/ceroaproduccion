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
    return new Response(JSON.stringify({ error: "Body inválido" }), { status: 400, headers });
  }

  const { email, turnstileToken } = body;

  if (!email || !turnstileToken) {
    return new Response(JSON.stringify({ error: "Email y token requeridos" }), { status: 400, headers });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return new Response(JSON.stringify({ error: "Email no válido" }), { status: 400, headers });
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

    const errorData = await resendRes.json();
    console.error("[subscribe] Resend error:", errorData);
    return new Response(JSON.stringify({ error: "No se pudo completar la suscripción" }), { status: 500, headers });
  } catch (err) {
    console.error("[subscribe] Error:", err);
    return new Response(JSON.stringify({ error: "Error interno" }), { status: 500, headers });
  }
};
