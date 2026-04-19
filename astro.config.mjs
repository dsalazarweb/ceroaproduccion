// @ts-check
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';

import react from '@astrojs/react';
import keystatic from '@keystatic/astro';

export default defineConfig({
  site: 'https://ceroaproduccion.dev',
  adapter: cloudflare(),
  integrations: [
    react(),
    keystatic(),
    mdx(),
    sitemap()
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    format: 'directory'
  }
});
