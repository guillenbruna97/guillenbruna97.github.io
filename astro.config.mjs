import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync } from 'node:fs';

// Elimina cualquier nodo HTML crudo del árbol Markdown antes de renderizarlo.
// El pipeline de Astro (remark/rehype) deja pasar HTML inline por defecto, y
// los artículos de src/content/articulos se generan y publican de forma
// automática sin revisión humana (ver .github/workflows/rutina-quincenal.yml).
// Esto actúa como cinturón de seguridad: si esa automatización llegara a
// escribir alguna vez una etiqueta <script>/<img onerror> (por una inyección
// de prompt vía WebSearch/WebFetch, o por error), no se renderiza en
// producción. No se usa ningún paquete npm nuevo para evitar depender de un
// `npm install` que este entorno no puede ejecutar/verificar localmente.
function remarkStripRawHtml() {
  return (tree) => stripHtmlNodes(tree);
}

function stripHtmlNodes(node) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node.children)) {
    node.children = node.children.filter((child) => child.type !== 'html');
    node.children.forEach(stripHtmlNodes);
  }
}

// <lastmod> del sitemap solo para artículos, sacado de su frontmatter
// (`updated` si existe, si no `date`). El resto de páginas no lo llevan a
// propósito: poner la fecha de build en todas le diría a Google que todo
// cambia en cada deploy, y deja de fiarse del campo.
const ARTICLES_DIR = new URL('./src/content/articulos/', import.meta.url);
const articleLastmod = new Map(
  readdirSync(ARTICLES_DIR)
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const frontmatter = readFileSync(new URL(file, ARTICLES_DIR), 'utf8').split('---')[1] ?? '';
      const field = (name) => frontmatter.match(new RegExp(`^${name}:\\s*(\\d{4}-\\d{2}-\\d{2})`, 'm'))?.[1];
      return [`/articulos/${file.replace(/\.md$/, '')}/`, field('updated') ?? field('date')];
    })
    .filter(([, date]) => date)
);

export default defineConfig({
  site: 'https://guillenbruna97.github.io',
  output: 'static',
  build: {
    format: 'directory',
  },
  markdown: {
    remarkPlugins: [remarkStripRawHtml],
  },
  integrations: [
    sitemap({
      serialize(item) {
        const lastmod = articleLastmod.get(new URL(item.url).pathname);
        if (lastmod) item.lastmod = new Date(lastmod).toISOString();
        return item;
      },
    }),
  ],
});
