import type { ImageMetadata } from 'astro';

// Copia optimizable (src/assets/articulos) de las imágenes de portada de los
// artículos. Los originales siguen en public/images/articulos/ sin tocarse,
// porque el campo `image` del frontmatter (usado también para las meta-tags
// OG/JSON-LD, que necesitan una URL pública plana) lo escribe la rutina
// automática semanal y no se puede cambiar su formato sin coordinarlo con
// esa automatización.
//
// Esta copia solo sirve para pintar la imagen en la propia página con
// astro:assets (AVIF/WebP + tamaños responsive). Si un artículo futuro no
// tiene copia aquí (porque la automatización no sabe de esta carpeta),
// getArticleImage() devuelve undefined y el componente cae automáticamente
// al <img> normal sobre el original de public/ — nunca rompe el build.
const images = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/articulos/*.{jpg,jpeg,png}',
  { eager: true }
);

const byFilename = new Map<string, ImageMetadata>();
for (const [path, mod] of Object.entries(images)) {
  const filename = path.split('/').pop();
  if (filename) byFilename.set(filename, mod.default);
}

export function getArticleImage(publicPath?: string): ImageMetadata | undefined {
  if (!publicPath) return undefined;
  const filename = publicPath.split('/').pop();
  return filename ? byFilename.get(filename) : undefined;
}
