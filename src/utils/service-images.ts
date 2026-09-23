import type { ImageMetadata } from 'astro';

// Mismo patrón que article-images.ts: copia optimizable (src/assets/servicios)
// de las ilustraciones de cabecera de cada ficha de servicio. El original
// sigue en public/images/servicios/ para el <img> de fallback y las meta-tags
// OG/JSON-LD, que necesitan una URL pública plana.
const images = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/servicios/*.{jpg,jpeg,png}',
  { eager: true }
);

const byFilename = new Map<string, ImageMetadata>();
for (const [path, mod] of Object.entries(images)) {
  const filename = path.split('/').pop();
  if (filename) byFilename.set(filename, mod.default);
}

export function getServiceImage(publicPath?: string): ImageMetadata | undefined {
  if (!publicPath) return undefined;
  const filename = publicPath.split('/').pop();
  return filename ? byFilename.get(filename) : undefined;
}
