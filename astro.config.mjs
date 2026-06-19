import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://guillenbruna97.github.io',
  output: 'static',
  build: {
    format: 'directory',
  },
});
