// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import preact from '@astrojs/preact';

export default defineConfig({
  site: 'https://truelegacyhomes.github.io',
  base: '/tlh-escrow-proposals/',
  output: 'static',
  integrations: [preact({ compat: true })],
  vite: {
    plugins: [tailwindcss()]
  }
});
