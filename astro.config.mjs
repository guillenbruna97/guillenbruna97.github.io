import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  site: 'https://guillenbruna97.github.io',
  output: 'static',

  build: {
    format: 'directory',
  },

  integrations: [sitemap()],
  adapter: cloudflare()
});