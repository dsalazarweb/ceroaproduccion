// @ts-check
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

// Keystatic es CMS local — solo se inyecta en desarrollo.
// En producción (Cloudflare Pages) el sitio se compila como SSG puro.
const isProd = process.env.NODE_ENV === 'production';
const integrations = [react(), mdx(), sitemap()];

if (!isProd) {
  const { default: keystatic } = await import('@keystatic/astro');
  integrations.push(keystatic());
}

export default defineConfig({
  site: 'https://ceroaproduccion.dev',
  integrations,
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    format: 'directory'
  }
});
