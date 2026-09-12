// Comprueba que todos los enlaces internos (href/src que empiezan por "/")
// de dist/ apuntan a un archivo real dentro del propio build. No usa
// dependencias nuevas (solo fs/path de Node) para poder correr en CI sin
// tocar package.json. Falla el proceso (exit 1) si encuentra un enlace roto.
import { readdirSync, statSync, readFileSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) walk(full, files);
    else if (extname(entry) === '.html') files.push(full);
  }
  return files;
}

function resolveInternalPath(link) {
  const clean = link.split('#')[0].split('?')[0];
  if (!clean || clean === '/') return join(DIST, 'index.html');
  if (extname(clean)) return join(DIST, clean);
  return join(DIST, clean, 'index.html');
}

if (!existsSync(DIST)) {
  console.error('No existe dist/ — ejecuta `npm run build` antes de este script.');
  process.exit(1);
}

const htmlFiles = walk(DIST);
const linkRegex = /(?:href|src)="(\/[^"]*)"/g;
let broken = 0;
let checked = 0;

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf-8');
  for (const match of html.matchAll(linkRegex)) {
    const link = match[1];
    if (link.startsWith('//')) continue; // protocol-relative externo
    checked++;
    const target = resolveInternalPath(link);
    if (!existsSync(target)) {
      console.error(`Enlace roto: "${link}" referenciado en ${file.replace(DIST, '')}`);
      broken++;
    }
  }
}

console.log(`Comprobados ${checked} enlaces internos en ${htmlFiles.length} páginas.`);
if (broken > 0) {
  console.error(`${broken} enlace(s) roto(s) encontrados.`);
  process.exit(1);
}
console.log('Sin enlaces internos rotos.');
