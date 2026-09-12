import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

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

export default defineConfig({
  site: 'https://guillenbruna97.github.io',
  output: 'static',
  build: {
    format: 'directory',
  },
  markdown: {
    remarkPlugins: [remarkStripRawHtml],
  },
  integrations: [sitemap()],
});
