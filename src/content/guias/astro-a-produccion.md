---
titulo: "De localhost a producción: Astro + Cloudflare Pages paso a paso"
descripcion: "Cómo monté este blog desde cero con Astro 6, lo conecté a Cloudflare Pages con deploy automático, registré un dominio .dev y configuré email profesional."
fecha: 2026-04-15
tags: ["astro", "cloudflare", "deploy", "dominio"]
dificultad: "intermedio"
tiempo_lectura: 15
serie: "devops-en-windows"
orden: 4
draft: false
imagen: "/images/guia4-hero.png"
---

Hasta aquí hemos llegado de la mano con las bases. Si pasaste por las tres guías anteriores ya viste que montamos en conjunto: 1) Todo el ecosistema WSL; 2) Una base real de documentación bajo un Vault SSOT, y; 3) El cómo nos complementamos la manera y los fallos al ser ayudados por inteligencia artificial sin tapujos.

Pero ya tocaba sacar la cara. Había que poner todo lo trabajado a dar luz verde frente al internet.

Lo que ahora estás leyendo es el blog que está corriendo nativo bajo Astro (en su versión 6) con despliegues a full modo "auto-deploy" por cada commit y push ejecutado por nuestro querido WSL hasta la plataforma de repositorios. Este ambiente luego dispara su output directamente a Cloudflare Pages como base, implementando toda mi configuración de dominio registrado (`.dev`) con acceso HTTPS automático, sin dejar atrás nuestro email profesional que acompaña. 

Aquí te enseño la recta desde 0, partiendo en un miserable `npm create` hasta subir todo.

## Crear el proyecto Astro

Te toca pararte bajo WSL dentro de tu ruta del proyecto así que abre Bash:

```bash
# Entiendo que te posicionaste bien. Haz cd a tus proyectos:
cd /mnt/d/Diego/Proyectos

# Y aquí disparamos nuestro Astro de cero:
npm create astro@latest ceroaproduccion
```

El wizard te hará unas preguntas: dile que te dé un **Empty project** (Proyecto vacío para mayor control limpiecito), dile que active **TypeScript Strict** y por supuesto asiente al requerimiento final: **Install dependencies**.

Listo, entra al entorno e inicias:

```bash
cd ceroaproduccion
npm run dev
# Y allí te abres en http://localhost:4321 — Si carga, ¡Felicidades!
```

> Aquí el contexto. ¿Astro? Sí, no uso Next.js, no uso Hugo, ni cosas más locas y ajenas como Gatsby para el blog por lo siguiente. Según una de mis decisiones de entorno (`DA-001`), tomamos Astro debido a que entrega **Zero JS por defecto** (su Core Web Vitals está hermoso por tener casi 0 de carga JS en su estado virgen), y trae las famosas 'Content Collections' para que uno administre los markdown al tiro. Astro es Content-first amigable, ni más que agregarle.

## Content Collections — Labs y Guías

Y justamente la maravilla es el Content Collections de Astro 6 que integra un cargador automático local (con `glob` package module local), lo cual reemplaza lo viejo de la v4 que te pedía tipo: content en todo tu schema.

Míralo así. Así tengo mis esquemas actuales, directo en mi `.ts` global de configuraciones:

```typescript
// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const labs = defineCollection({
  loader: glob({ base: './src/content/labs', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    titulo: z.string(),
    descripcion: z.string(),
    fecha: z.coerce.date(),
    fase: z.number(),
    dia: z.number(),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
  }),
});
```

Zod (`z`) hace validación interna. ¿Qué ocurre si mandas la fecha o número en string cuando configuraste en TypeScript `z.number()` o ignoraste un tag si lo hiciste todo por defecto como obligatorio (como yo hago la mayoría de mis schemas)? Sencillo: **Astro NO CONSTRUYE.** Punto. Se cae en rojo y lanza un error fatal. Y te quiero recalcar algo: este rechazo del build no está diseñado como una carga loca para los editores o redactores que suben la nota... no... **Esto es una red de seguridad infalible**. Me ha tirado los logs mostrándome cuáles fallan a golpe de un plumazo (me salva por sobre todas las cosas si no uso el entorno gráfico aún local de contenido). Si Astro compila, sabrás de entrada que TODO el Markdown lo rellenaste perfecto hasta de frente.

## Correr en local

No hay misterios, tú mandas por la Shell (`wsl`) esto:

```bash
cd /mnt/d/Diego/Proyectos/ceroaproduccion
npm run dev
# → te deja a puerto http://localhost:4321 montando todo
```

Aquí Astro hace toda la magia `hot reaload`, la típica: vas y trabajas en la interfaz usando Tailwind o directo Vanilla (que fue por ese último que decidí usar aquí, por mi propio control CSS root), arreglas todo, borras, añades tags, etc...

Ahora, hay que hacer siempre validación `build`:

```bash
npm run build
```

Es imperativo que **hagas `npm run build` en modo test.** Todo lo que corre en `localhost/dev` local en entorno interactivo pasa... pero tu build production va a ser super estricto y allí arroja cada error no solucionado. Como digo en las reglas de compilado: "Si algo estalla, te avisaron temprano; repáralo".

## Cloudflare Pages — Deploy automático

![Diagrama de flujo: git push, GitHub, Cloudflare Build, sitio en vivo](/images/guia4-cloudflare-pages.png)

Tu base local es genial pero nadie más te vio en la red. Vamos a Cloudflare Pages que, de cajón, es la joya total del asunto con todo y deploy automatizado.

### Paso por repositorio

1. Vas y levantas un repo de cero público (en mi caso personal: `dsalazarweb/ceroaproduccion`). Ojo, siempre desde tu cuenta real.

2. Inicias local para inyectar todo en el nuevo Repo dentro del Bash de WSL:

```bash
git init
git add .
git commit -m "feat: inicio del proyecto ceroaproduccion"
# ⚠️ Cambia la URL por la de TU repositorio en GitHub
git remote add origin git@github.com:dsalazarweb/ceroaproduccion.git
git push -u origin main
```

*(Si seguiste la Guía 1 todo te debe fluir super porque el Bash ya se conoce tu clave privada conectada contra tu servidor)*

### Paso por el Cloudflare dashboard

Nada de manualidades horribles o pipelines YAML sueltos tirados sobre una terminal de git.

Vamos fácil:
1. Accede al portal logueado a tu entorno Cloudflare en el área interna y te fijas: **Workers & Pages → Create → Connect to Git**.
2. Dale privilegios, sincronizas, eliges repos. 
3. Dejar los settings principales como esto:
   - Framework preset: Seleccionarás el precioso **Astro** que vendrá puesto allí.
   - Build command: Asegurarse de que esté en **`npm run build`** (usualmente lo agarra)
   - Build output directory: Apuntándole a **`dist`** que es donde cae compilado (suele dar ese).
4. Save and Deploy... **Voila**

Con eso tu sitio está actualizado y ya en cada próximo `git push`, en cosa de 30 a 50 segundos, saltará al vivo.

## Dominio .dev — HTTPS por defecto

![Navegador mostrando ceroaproduccion.dev con candado HTTPS](/images/guia4-dominio.png)

Astro ya te mandará tu enlace de host bajo dominio Cloudflare (ej: `ceroaproduccion.pages.dev`).

Yo te aseguro algo, un sitio hoy día con marca técnica personal lleva un dominio más cercano al entorno DEV técnico, de esa manera, para mis decisiones me fui a un `.dev` puro. Como te detallo en arquitectura, el ser un `.dev` "fuerza un certificado HTTPS cifrado en navegadores", si intentas montarlo a las bravas por HTTP tirará al demonio una falla al entrar desde Edge y Chrome porque ya ni te lo admite desprotegido.

¿A nivel Cloud? Facilito:
- Una vez registrado un dominio a Cloudflare Registrar... tu sitio (ceroaproduccion.dev en mi caso) lo ligas dactilarmente:
- A nivel site interno de project ve a: **Pages → Custom domains**
- Metes tu dominio allí, y el core te hace hasta los redireccionamientos DNS puros él sólito bajo automatización. Esperas que validaciones completen y ¡tu web en tu host real! 

## Email profesional con dominio propio

![Mockup de email profesional con dominio ceroaproduccion.dev](/images/guia4-email.png)

Esto le da a todo proyecto su verdadero "¡Mira este es mi lado profesional, amigo!". Un email gratuito y personal no genera confianza real al dar feedback. Tu proyecto vale y tú tienes tu marca técnica.

Para mí, elegí **Zoho Mail (gratis para 1 usuario pero a nivel Full Custom Domain Email en su app core)**:
Te montan correos bases, aquí mis ejemplos:
- `hola@ceroaproduccion.dev` — La bandera base de entrada.
- `admin@ceroaproduccion.dev` — Donde van todos mis mails transaccionales ocultos (sistemas externos) que vimos atrás en esta serie entera (en mis SSH, git globals, etc.)
- `contacto@ceroaproduccion.dev` — Mi bandeja prioritaria limpia de todo, adonde va cada formulario o dudas para clientes externos.

Cloudflare en un click acepta todo registro temporal automatizado sin matarse insertando TXTs extraños para el Zoho o viceversa. Así tienes tu entorno base perfecto.

## Lo que viene después...

El cierre de proyecto inicial no se queda acá, ¿Sino sería ir muy simplón para nosotros no?. Sobre la mesa en la base verás poco a poco desplegado como implementamos en futuro en el repositorio del proyecto central esto:
- **Cloudflare Turnstile** para cortar con los asquerosos bots en toda entrada o login.
- **Newsletter** implementando a puro pulso sobre APIs con Resend como herramienta base core (además con Full double Opt-in del user para cero riesgos Spam!)
- Analítica libre y limpia como nos la dicta el umami: Instalaremos a **Umami Cloud** para privacidad amigable; fuera métricas que espían galletas por todo lado.
- Todo esto sin faltar seguridad de limiters para mis APIs Serverless. Todo documentado en otros Labs... si te gustan mis temas claro; nos seguimos viendo en `labs`.

> "Hace un mes, ceroaproduccion.dev no existía. Hoy tiene labs publicados, formularios seguros, y deploy automático amarrado. Lo más difícil no fue la tecnología — fue empezar."

Esta guía es la última de la serie **DevOps en Windows**. Si te la perdiste, empieza por el principio: 
1. [DevOps en Windows: base WSL](/guias/mi-entorno-devops-en-windows)
2. [Estrategia con Obsidian y Vault](/guias/metodologia-proyecto)
3. [IA para documentar sin mentiras](/guias/ia-en-mi-aprendizaje)
