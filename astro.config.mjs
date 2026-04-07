// @ts-check
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://ceroaproduccion.dev',
  
  // 🏛️ [Arquitecto]: Cambiamos a modo 'server' para habilitar SSR (Server Side Rendering)
  // Esto es lo que permite que tu API de contacto y el newsletter funcionen.
  output: 'server',

  integrations: [mdx(), sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },

  // ⚙️ [DevOps]: El adaptador de Cloudflare ahora sí gestionará las peticiones dinámicas.
  adapter: cloudflare(),

  // 🎨 [Frontend Lead]: Forzamos URLs limpias (sin .html) para que la navegación sea profesional.
  build: {
    format: 'directory'
  }
});