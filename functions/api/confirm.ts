interface Env {
  RESEND_API_KEY: string;
  RESEND_AUDIENCE_ID: string;
  AUTH_SECRET: string;
}

// Verifica el token firmado
async function verifyToken(token: string, secret: string): Promise<string | null> {
  try {
    // Decodificar base64 seguro para URL
    const decoded = atob(token.replace(/-/g, '+').replace(/_/g, '/'));
    const parts = decoded.split('|');
    if (parts.length !== 3) return null;

    const [email, expires, hash] = parts;

    // Verificar expiración
    if (Date.now() > parseInt(expires)) return null;

    // Re-generar firma para comparar
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    
    const data = `${email}|${expires}`;
    const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
    const hashArray = Array.from(new Uint8Array(signature));
    const expectedHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return hash === expectedHash ? email : null;
  } catch {
    return null;
  }
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return new Response("Token faltante", { status: 400 });
  }

  const email = await verifyToken(token, env.AUTH_SECRET);

  if (!email) {
    return new Response("Enlace de confirmación inválido o expirado", { status: 403 });
  }

  // Si el token es válido, añadir a Resend
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

    // Redirigir a una página de éxito (o mostrar HTML simple)
    if (resendRes.ok || (await resendRes.json() as any).message?.includes("already_exists")) {
      return new Response(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Suscripción Confirmada | Cero a Producción</title>
          <style>
            body { font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f9fafb; color: #111827; }
            .card { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); text-align: center; max-width: 400px; }
            h1 { color: #2337ff; margin-bottom: 1rem; }
            a { color: #2337ff; text-decoration: none; font-weight: 600; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>¡Suscripción Confirmada! 🎉</h1>
            <p>Tu correo <strong>${email}</strong> ha sido verificado correctamente.</p>
            <p>Bienvenido a la comunidad de Cero a Producción.</p>
            <br>
            <a href="/">Volver al blog</a>
          </div>
        </body>
        </html>
      `, {
        headers: { "Content-Type": "text/html; charset=UTF-8" }
      });
    }

    return new Response("Error al procesar la suscripción", { status: 500 });
  } catch (err) {
    return new Response("Error de servidor", { status: 500 });
  }
};
