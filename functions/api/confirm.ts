interface Env {
  RESEND_API_KEY: string;
  RESEND_AUDIENCE_ID: string;
  AUTH_SECRET: string;
}

async function verifyToken(token: string, secret: string): Promise<string | null> {
  try {
    const decoded = atob(token.replace(/-/g, '+').replace(/_/g, '/'));
    const parts = decoded.split('|');
    if (parts.length !== 3) return null;

    const [email, expires, hash] = parts;
    if (Date.now() > parseInt(expires)) return null;

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

  const commonHead = `
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&display=swap" rel="stylesheet">
    <style>
      :root {
        --accent: #2337ff;
        --text-primary: #0f1219;
        --text-secondary: #60739f;
        --bg-primary: #ffffff;
        --bg-secondary: #f8f8f6;
        --border-color: #e8e8e4;
      }
      body {
        font-family: 'Atkinson Hyperlegible', sans-serif;
        background-color: var(--bg-primary);
        color: var(--text-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
        margin: 0;
        padding: 20px;
        text-align: center;
        background-image: radial-gradient(circle at 50% 50%, #f0f2ff 0%, var(--bg-primary) 100%);
      }
      .card {
        max-width: 480px;
        width: 100%;
        padding: 48px 32px;
        border-radius: 20px;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        box-shadow: 0 10px 25px rgba(35, 55, 255, 0.05);
      }
      .icon { font-size: 56px; margin-bottom: 24px; display: block; }
      h1 { font-size: 2.4rem; color: var(--text-primary); margin: 0 0 16px 0; font-weight: 700; line-height: 1.1; }
      p { font-size: 1.15rem; line-height: 1.6; color: var(--text-secondary); margin-bottom: 32px; }
      .btn {
        display: inline-block;
        padding: 16px 32px;
        background: var(--accent);
        color: white !important;
        text-decoration: none;
        border-radius: 8px;
        font-weight: 700;
        font-size: 1.1rem;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        box-shadow: 0 4px 14px rgba(35, 55, 255, 0.3);
      }
      .btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(35, 55, 255, 0.4);
      }
      strong { color: var(--text-primary); }
      .error-h1 { color: #b91c1c; }
    </style>
  `;

  if (!token) {
    return new Response(`<!DOCTYPE html><html><head>${commonHead}<title>Error | Cero a Producción</title></head><body><div class="card"><span class="icon">⚠️</span><h1 class="error-h1">Token faltante</h1><p>El enlace de confirmación no es válido.</p><a href="/" class="btn">Volver al Inicio</a></div></body></html>`, { headers: { "Content-Type": "text/html; charset=UTF-8" } });
  }

  const email = await verifyToken(token, env.AUTH_SECRET);

  if (!email) {
    return new Response(`<!DOCTYPE html><html><head>${commonHead}<title>Enlace Expirado | Cero a Producción</title></head><body><div class="card"><span class="icon">⏳</span><h1 class="error-h1">Enlace expirado</h1><p>Lo sentimos, este enlace de confirmación ha caducado. Por favor, intenta suscribirte de nuevo en el blog.</p><a href="/" class="btn">Volver al Inicio</a></div></body></html>`, { headers: { "Content-Type": "text/html; charset=UTF-8" } });
  }

  try {
    await fetch(
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

    return new Response(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        ${commonHead}
        <title>Suscripción Confirmada | Cero a Producción</title>

      </head>
      <body>
        <div class="card">
          <span class="icon">🚀</span>
          <h1>¡Ya eres parte de la comunidad!</h1>
          <p>Tu correo <strong>${email}</strong> ha sido verificado. Prepárate para recibir contenido real sobre DevOps e infraestructura cloud.</p>
          <a href="/" class="btn">Ir al Blog</a>
        </div>
      </body>
      </html>
    `, { headers: { "Content-Type": "text/html; charset=UTF-8" } });
  } catch (err) {
    return new Response("Error de servidor", { status: 500 });
  }
};
