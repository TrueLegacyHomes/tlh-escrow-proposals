// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import preact from '@astrojs/preact';

export default defineConfig({
  output: 'static',
  integrations: [preact({ compat: true })],
  vite: {
    plugins: [tailwindcss()]
  }
});
