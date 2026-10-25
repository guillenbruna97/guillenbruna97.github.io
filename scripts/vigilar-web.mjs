// Vigila la web publicada (no el build): cada URL del sitemap responde 200, no lleva
// noindex por error, y sus enlaces internos e imágenes cargan. Sin dependencias.
// Lo lanza a diario .github/workflows/vigilar-web.yml y la rutina semanal del puesto SEO.
// Uso: node scripts/vigilar-web.mjs [https://otra-web/]   Sale con código 1 si hay algún problema.
const SITE = (process.argv[2] || 'https://gbtconsultoria.com/').replace(/\/?$/, '/');
const problemas = [];

async function pedir(url) {
  for (let intento = 1; ; intento++) {
    try {
      const res = await fetch(url, { redirect: 'follow', headers: { 'User-Agent': 'vigilar-web (guillenbruna)' } });
      return { status: res.status, texto: res.headers.get('content-type')?.includes('html') || url.endsWith('.xml') ? await res.text() : '' };
    } catch (e) {
      if (intento >= 3) return { status: 0, texto: '', error: e.cause?.code || e.message };
      await new Promise((r) => setTimeout(r, 2000 * intento));
    }
  }
}

const locs = (xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());

// 1. Sitemap: el índice apunta a sitemaps, y estos a las URLs.
const indice = await pedir(new URL('sitemap-index.xml', SITE).href);
if (indice.status !== 200) {
  problemas.push(`El sitemap no responde (${indice.status || indice.error}): ${SITE}sitemap-index.xml`);
}
const urls = [];
for (const sm of locs(indice.texto)) urls.push(...locs((await pedir(sm)).texto));
if (indice.status === 200 && !urls.length) problemas.push('El sitemap no lista ninguna URL.');

// 2. Cada página: responde, es indexable y sus enlaces internos e imágenes cargan.
const enlaces = new Map(); // destino -> página donde aparece
for (const url of urls) {
  const { status, texto, error } = await pedir(url);
  if (status !== 200) { problemas.push(`${url} responde ${status || error}`); continue; }
  if (/<meta[^>]+name=["']robots["'][^>]+noindex/i.test(texto)) problemas.push(`${url} está en el sitemap pero lleva noindex`);
  if (!/<title>[^<]+<\/title>/i.test(texto)) problemas.push(`${url} no tiene <title>`);
  for (const [, ruta] of texto.matchAll(/(?:href|src)="((?:\/(?!\/)|https?:\/\/guillenbruna97\.github\.io\/)[^"#?]*)/g)) {
    const destino = new URL(ruta, SITE).href;
    if (!enlaces.has(destino)) enlaces.set(destino, url);
  }
}
for (const [destino, origen] of enlaces) {
  if (urls.includes(destino)) continue; // ya comprobada como página
  // Cloudflare cambia los mailto por /cdn-cgi/l/email-protection y los descifra con JS:
  // sin JS responde 404, pero para el visitante el enlace funciona. No es un enlace roto.
  if (new URL(destino).pathname.startsWith('/cdn-cgi/')) continue;
  const { status, error } = await pedir(destino);
  if (status !== 200) problemas.push(`Enlace roto ${destino} (${status || error}), enlazado desde ${origen}`);
}

console.log(`Vigilancia de ${SITE}: ${urls.length} páginas y ${enlaces.size} enlaces internos e imágenes comprobados.`);
if (!problemas.length) {
  console.log('Sin problemas.');
} else {
  console.log(`\n${problemas.length} problema(s):\n`);
  for (const p of problemas) console.log(`- ${p}`);
  process.exit(1);
}
