# Cero a Producción (ceroaproduccion.dev)

El frontend completo, CMS y ecosistema legal detrás del blog y hoja de ruta DevOps: **Cero a Producción**. 

Navegar hacia producción no debería ser tortuoso. Este repositorio encapsula un hub ultrarrápido y seguro construido para compartir experiencias técnicas en tiempo real, aislar laboratorios de AWS/Linux y presentar una identidad digital inamovible utilizando la arquitectura JAMStack y Cloudflare.

[![Astro](https://img.shields.io/badge/Astro%206-FF5D01?style=for-the-badge&logo=astro&logoColor=white)](https://astro.build/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare_Pages-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://pages.cloudflare.com/)

---

## 🏗️ Pila Tecnológica (Stack)

- **Framework Core**: [Astro 6](https://astro.build/) (Island Architecture / SSG)
- **Estilos**: Tailwind CSS con sistema de diseño personalizado en variables nativas (`BaseHead.astro`).
- **CMS Interno**: [Keystatic](https://keystatic.com) operando visualmente y emparejado con colecciones estrictas de Zod, exportando contenido en `.md`.
- **Despliegue y CDN**: Cloudflare Pages (Deploy vía push a `main`).
- **Analítica**: Google Analytics 4 (Con Consent Mode v2 Custom e inyección `gtag` desde *LocalStorage*).
- **Seguridad Antispam**: Cloudflare Turnstile nativo activado para endpoints (Resend Node API).

---

## 🚀 Despliegue Local (`localhost`)

Para contribuir o testear nuevas integraciones, ejecuta el sitio de la siguiente forma. *(Requiere Node 20+ y preferiblemente entorno WSL en Windows)*.

1. **Instala las dependencias:**
```sh
npm install
# Nota: usa --legacy-peer-deps si Keystatic colisiona con dependencias nativas modernas de Astro v6
```

2. **Levanta el servidor local:**
```sh
npm run dev
```
> La web estará disponible en `http://localhost:4321`.
> El panel administrador de Keystatic (CMS visual) estará disponible en `http://localhost:4321/keystatic`.

### Compilación Pura para Analizar Rendimiento
Si quieres testear cómo se generarán las rutas estáticas antes de que Cloudflare las tome:
```sh
npm run build
npm run preview
```

---

## 🔒 Arquitectura Legal y Cumplimiento

[![Licencia Creative Commons](https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png)](http://creativecommons.org/licenses/by-nc-nd/4.0/)

Este repositorio aloja la **[LICENCIA_MAESTRA_ES.md](LICENSE_MAESTRA_ES.md)** en su raíz. Como se indica explícitamente en `src/pages/terminos.astro` y en nuestra base legal:
- El uso de la marca comercial *"Cero a Producción"*, así como copias exactas del diseño visual para reventa están restringidas.
- **Prohibido el rasgado/scraping:** Toda recolección automatizada del contenido de los laboratorios o guías para **entrenamiento de modelos de inteligencia artificial (LLMs)** está prohibida por política expresa y bloqueada por `robots.txt`.

Los fragmentos y *snippets* de código presentes dentro de los archivos de laboratorios o guías (`src/content/`) son de dominio libre y pueden utilizarse en proyectos personales y servidores mediante la filosofía MIT, sin necesidad de atribución obligatoria.

---

El dominio principal es `ceroaproduccion.dev`. También se puede acceder mediante `ceroaproduccion.com`, el cual redirige de manera automática el tráfico al dominio `.dev`.
