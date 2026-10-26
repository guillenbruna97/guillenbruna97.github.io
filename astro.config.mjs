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

// Categorías del blog fusionadas en la reorganización de octubre de 2026
// (ver src/utils/articles.ts). En salida estática Astro genera una página con
// meta refresh + canonical hacia el destino; se excluyen del sitemap abajo.
const categoryRedirects = {
  '/articulos/categoria/branding/': '/articulos/categoria/marca/',
  '/articulos/categoria/marca-personal/': '/articulos/categoria/comunicacion/',
  '/articulos/categoria/pipeline/': '/articulos/categoria/go-to-market/',
  '/articulos/categoria/seo/': '/articulos/categoria/ia-en-marketing/',
};

// /sobre-mi/ y /como-trabajo/ se unieron en /quienes-somos/ (reenfoque a GBT
// Consultoría, 2026-10-23).
const pageRedirects = {
  '/sobre-mi/': '/quienes-somos/',
  '/como-trabajo/': '/quienes-somos/#como-trabajamos',
  // Grupo Rey se separó en Muebles Rey, Muebles Tuco y SLM (2026-10-24).
  '/trabajo/grupo-rey/': '/trabajo/muebles-rey/',
};
const allRedirects = { ...categoryRedirects, ...pageRedirects };

// PREPRO=1: copia de preproducción en Cloudflare (npm run deploy:prepro). Misma
// web, pero noindex en todo, aviso arriba y sin Analytics ni envíos a HubSpot.
// El canonical sigue apuntando a gbtconsultoria.com. Ver
// marca-personal/montaje-web/metodologia-preproduccion.md.
const prepro = process.env.PREPRO === '1';

export default defineConfig({
  site: 'https://gbtconsultoria.com',
  output: 'static',
  build: {
    format: 'directory',
  },
  redirects: allRedirects,
  vite: { define: { __PREPRO__: JSON.stringify(prepro) } },
  markdown: {
    remarkPlugins: [remarkStripRawHtml],
  },
  integrations: [
    sitemap({
      // Las páginas 2, 3… de los listados entran: son indexables con su propio
      // canonical, como recomienda Google para la paginación.
      filter: (page) => !(new URL(page).pathname in allRedirects),
      serialize(item) {
        const lastmod = articleLastmod.get(new URL(item.url).pathname);
        if (lastmod) item.lastmod = new Date(lastmod).toISOString();
        return item;
      },
    }),
  ],
});
