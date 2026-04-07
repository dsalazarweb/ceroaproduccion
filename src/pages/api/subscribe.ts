export const prerender = false;

import type { APIRoute } from "astro";

const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;
const RESEND_AUDIENCE_ID = import.meta.env.RESEND_AUDIENCE_ID;
const TURNSTILE_SECRET_KEY = import.meta.env.TURNSTILE_SECRET_KEY;

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
  let body: { email?: string; turnstileToken?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Body inválido" }), {
      status: 400, headers: { "Content-Type": "application/json" },
    });
  }

  const { email, turnstileToken } = body;

  if (!email || !turnstileToken) {
    return new Response(JSON.stringify({ error: "Email y token son requeridos" }), {
      status: 400, headers: { "Content-Type": "application/json" },
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return new Response(JSON.stringify({ error: "Email no válido" }), {
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
    const resendRes = await fetch(
      `https://api.resend.com/audiences/${RESEND_AUDIENCE_ID}/contacts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          email,
          unsubscribed: false,
        }),
      }
    );

    if (resendRes.status === 200 || resendRes.status === 201) {
      return new Response(JSON.stringify({ success: true, message: "¡Suscripción exitosa!" }), {
        status: 200, headers: { "Content-Type": "application/json" },
      });
    }

    const errorData = await resendRes.json();
    console.error("[subscribe] Resend error:", errorData);
    return new Response(JSON.stringify({ error: "No se pudo completar la suscripción" }), {
      status: 500, headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[subscribe] Error inesperado:", err);
    return new Response(JSON.stringify({ error: "Error interno del servidor" }), {
      status: 500, headers: { "Content-Type": "application/json" },
    });
  }
};
