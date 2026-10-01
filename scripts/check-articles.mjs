// Valida los artículos de src/content/articulos contra las reglas editoriales
// y SEO del blog. Lo ejecutan el CI, el deploy y la rutina automática de
// artículos (seo-ai-system/knowledge-base/rutina-quincenal.md) antes de
// publicar, para que un artículo nuevo salga ya con H2, enlaces internos,
// categoría válida y metadatos en longitud, sin retoques manuales después.
//
// Uso: node scripts/check-articles.mjs [slug ...]
//   Sin argumentos revisa todos. Errores = exit 1. Avisos no bloquean.
// Sin dependencias (solo fs) para no tocar package.json.
import { readdirSync, readFileSync, existsSync } from 'node:fs';

const ROOT = new URL('../', import.meta.url);
const ARTICLES_DIR = new URL('src/content/articulos/', ROOT);
const BRAND_SUFFIX = ' | Guillén Bruna Tricas';
const MAX_TITLE = 60;
const WORDS_PER_MINUTE = 200;

// Fuente de verdad: src/utils/articles.ts (CATEGORIES) y src/consts.ts (SERVICES).
const articlesTs = readFileSync(new URL('src/utils/articles.ts', ROOT), 'utf8');
const CATEGORY_NAMES = [...articlesTs.matchAll(/^\s+nombre: '([^']+)'/gm)].map((m) => m[1]);
const constsTs = readFileSync(new URL('src/consts.ts', ROOT), 'utf8');
const SERVICE_SLUGS = [...constsTs.matchAll(/^\s+slug: '([^']+)'/gm)].map((m) => m[1]);

const allSlugs = readdirSync(ARTICLES_DIR)
  .filter((f) => f.endsWith('.md'))
  .map((f) => f.replace(/\.md$/, ''));

const targets = process.argv.slice(2).length ? process.argv.slice(2) : allSlugs;

function parse(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return null;
  const data = {};
  for (const line of match[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) data[kv[1]] = kv[2].replace(/^"(.*)"$/, '$1');
  }
  return { data, body: match[2] };
}

const countWords = (text) =>
  text
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#*_>`]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;

let errorCount = 0;
let warningCount = 0;

for (const slug of targets) {
  const file = new URL(`${slug}.md`, ARTICLES_DIR);
  const errors = [];
  const warnings = [];

  if (!existsSync(file)) {
    console.error(`✗ ${slug}: no existe src/content/articulos/${slug}.md`);
    errorCount++;
    continue;
  }
  const parsed = parse(readFileSync(file, 'utf8'));
  if (!parsed) {
    console.error(`✗ ${slug}: frontmatter mal formado (debe abrir y cerrar con ---)`);
    errorCount++;
    continue;
  }
  const { data, body } = parsed;

  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) errors.push('el nombre de archivo (slug) debe ir en minúsculas, sin tildes y con guiones');

  for (const field of ['title', 'seoTitle', 'tag', 'excerpt', 'description', 'date', 'readingTime', 'service']) {
    if (!data[field]) errors.push(`falta el campo "${field}" en el frontmatter`);
  }

  if (data.seoTitle) {
    const full = data.seoTitle + BRAND_SUFFIX;
    if (full.length > MAX_TITLE) errors.push(`seoTitle demasiado largo: "${full}" tiene ${full.length} caracteres (máx. ${MAX_TITLE}, o sea ${MAX_TITLE - BRAND_SUFFIX.length} sin el sufijo)`);
  }

  if (data.description && (data.description.length < 120 || data.description.length > 160)) {
    errors.push(`description con ${data.description.length} caracteres (debe tener entre 120 y 160)`);
  }

  if (data.excerpt && data.excerpt.length > 200) warnings.push(`excerpt con ${data.excerpt.length} caracteres (recomendado ≤ 200)`);

  if (data.tag) {
    const [category, ...rest] = data.tag.split('·').map((s) => s.trim());
    if (!CATEGORY_NAMES.includes(category)) errors.push(`categoría "${category}" no válida en tag; usa una de: ${CATEGORY_NAMES.join(', ')}`);
    if (!rest.join('').trim()) errors.push('tag sin subcategoría: formato "Categoría · Subtema"');
  }

  if (data.service && !SERVICE_SLUGS.includes(data.service)) {
    errors.push(`service "${data.service}" no existe; usa uno de: ${SERVICE_SLUGS.join(', ')}`);
  }

  if (data.date && !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) errors.push('date debe ir como AAAA-MM-DD sin comillas');

  if (data.readingTime) {
    const expected = Math.max(1, Math.ceil(countWords(body) / WORDS_PER_MINUTE));
    const declared = Number(data.readingTime.match(/^(\d+) min de lectura$/)?.[1]);
    if (!declared) errors.push('readingTime debe tener el formato "X min de lectura"');
    else if (Math.abs(declared - expected) > 1) errors.push(`readingTime dice ${declared} min pero el cuerpo da ${expected} min (${WORDS_PER_MINUTE} palabras/min)`);
  }

  if (!data.image) warnings.push('sin imagen de portada (image/imageAlt): pendiente de añadir a mano');
  else if (!data.imageAlt) errors.push('tiene image pero falta imageAlt');

  // Cuerpo
  if (/^# /m.test(body)) errors.push('el cuerpo no debe llevar H1 (# ...): el H1 sale del campo title');
  const h2 = body.match(/^## .+$/gm) ?? [];
  if (h2.length < 3) errors.push(`solo ${h2.length} H2; mínimo 3 secciones con "## "`);
  if (/^#{4,} /m.test(body)) warnings.push('usa H4 o inferior; mantener jerarquía en H2/H3');
  if (/<[a-z][^>]*>/i.test(body)) errors.push('contiene HTML crudo; solo Markdown');
  if (/—/.test(body)) errors.push('contiene guiones largos (—); el estilo editorial los evita');

  const links = [...body.matchAll(/\]\((\/[^)\s]*)\)/g)].map((m) => m[1]);
  const articleLinks = new Set(
    links
      .map((href) => href.match(/^\/articulos\/([a-z0-9-]+)\/?(?:#.*)?$/)?.[1])
      .filter((s) => s && s !== 'categoria')
  );
  for (const target of articleLinks) {
    if (target === slug) errors.push('se enlaza a sí mismo');
    else if (!allSlugs.includes(target)) errors.push(`enlace a un artículo que no existe: /articulos/${target}/`);
  }
  for (const href of links) {
    const svc = href.match(/^\/servicios\/([a-z0-9-]+)\/?/)?.[1];
    if (svc && !SERVICE_SLUGS.includes(svc)) errors.push(`enlace a un servicio que no existe: ${href}`);
    if (!href.endsWith('/') && !href.includes('#')) warnings.push(`enlace interno sin barra final: ${href}`);
  }
  const otherArticles = [...articleLinks].filter((s) => s !== slug).length;
  if (otherArticles < 2) errors.push(`solo ${otherArticles} enlaces internos a otros artículos; mínimo 2`);

  for (const w of warnings) console.warn(`! ${slug}: ${w}`);
  for (const e of errors) console.error(`✗ ${slug}: ${e}`);
  errorCount += errors.length;
  warningCount += warnings.length;
}

console.log(`\nRevisados ${targets.length} artículos: ${errorCount} errores, ${warningCount} avisos.`);
if (errorCount > 0) process.exitCode = 1;
