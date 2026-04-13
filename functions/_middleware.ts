// In-memory rate limit store para el contexto del V8 Isolate de Cloudflare
// Nota: En Edge computing esto es local a cada nodo/datacenter y reseteable en despliegues.
// Funciona como una defensa básica L7 in-code.
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

export const onRequest: PagesFunction = async (context) => {
  const url = new URL(context.request.url);

  // Solo aplicar rate limiting a las peticiones del backend /api/
  if (url.pathname.startsWith('/api/')) {
    // Si pre-flight CORS, dejamos pasar
    if (context.request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "https://ceroaproduccion.dev",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
        }
      });
    }

    const ip = context.request.headers.get("CF-Connecting-IP") || "unknown";
    const now = Date.now();
    const limit = 5; // Límite de peticiones
    const windowMs = 60000; // Ventana de 1 minuto

    // Cleanup periódico básico
    if (Math.random() < 0.1) {
      for (const [key, val] of rateLimitMap.entries()) {
        if (now - val.timestamp > windowMs) {
          rateLimitMap.delete(key);
        }
      }
    }

    const current = rateLimitMap.get(ip);
    if (current) {
      if (now - current.timestamp < windowMs) {
        if (current.count >= limit) {
          return new Response(JSON.stringify({ error: "Has llegado al límite de peticiones. Intenta de nuevo en 1 minuto." }), {
            status: 429,
            headers: { 
              'Content-Type': 'application/json',
              'Retry-After': '60'
            }
          });
        }
        current.count++;
      } else {
        rateLimitMap.set(ip, { count: 1, timestamp: now });
      }
    } else {
      rateLimitMap.set(ip, { count: 1, timestamp: now });
    }
  }

  // Continuar con la ejecución normal
  return await context.next();
};
