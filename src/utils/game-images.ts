import type { ImageMetadata } from 'astro';

// Mismo patrón que article-images.ts: copia optimizable (src/assets/minijuegos)
// de la portada de cada minijuego. El original sigue en public/images/minijuegos/
// para el <img> de fallback y la meta-tag OG, que necesita una URL pública plana.
const images = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/minijuegos/*.{jpg,jpeg,png}',
  { eager: true }
);

const byFilename = new Map<string, ImageMetadata>();
for (const [path, mod] of Object.entries(images)) {
  const filename = path.split('/').pop();
  if (filename) byFilename.set(filename, mod.default);
}

export function getGameImage(publicPath?: string): ImageMetadata | undefined {
  if (!publicPath) return undefined;
  const filename = publicPath.split('/').pop();
  return filename ? byFilename.get(filename) : undefined;
}
