// Remata el build de preproducción (PREPRO=1) antes de subirlo a Cloudflare:
// robots.txt que bloquea todo y cabecera X-Robots-Tag en todas las rutas, por
// si algún buscador llega a la URL aunque las páginas ya lleven noindex.
import { readFileSync, writeFileSync } from 'node:fs';

const dist = new URL('../dist/', import.meta.url);
writeFileSync(new URL('robots.txt', dist), 'User-agent: *\nDisallow: /\n');

const headersUrl = new URL('_headers', dist);
const headers = readFileSync(headersUrl, 'utf8').replace(/^\/\*\n/m, '/*\n  X-Robots-Tag: noindex, nofollow\n');
if (!headers.includes('X-Robots-Tag')) throw new Error('No se pudo añadir X-Robots-Tag a dist/_headers');
writeFileSync(headersUrl, headers);

const home = readFileSync(new URL('index.html', dist), 'utf8');
if (!home.includes('noindex,nofollow')) throw new Error('La home no lleva noindex: ¿se compiló con PREPRO=1?');
console.log('Preproducción lista: robots.txt bloqueado, X-Robots-Tag y noindex comprobados.');
