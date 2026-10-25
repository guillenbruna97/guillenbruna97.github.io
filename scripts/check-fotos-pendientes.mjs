// Falla si el build lleva algún hueco de foto (componente FotoPendiente). Los
// huecos solo valen en preproducción: antes de lanzar a producción cada uno se
// cambia por la foto real. Uso: node scripts/check-fotos-pendientes.mjs (tras el build).
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const dist = new URL('../dist/', import.meta.url).pathname;
const pendientes = [];
const walk = (dir) => {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (f.endsWith('.html') && readFileSync(p, 'utf8').includes('data-foto-pendiente')) pendientes.push(p.replace(dist, '/'));
  }
};
walk(dist);
if (pendientes.length) {
  console.error(`Huecos de foto sin sustituir en ${pendientes.length} página(s):\n${pendientes.join('\n')}`);
  process.exit(1);
}
console.log('Sin huecos de foto pendientes.');
