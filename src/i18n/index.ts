// Idiomas de la web (2026-10-25). Español en la raíz y la versión inglesa bajo
// /en/, indexable y enlazada con hreflang. Por ahora se traducen las páginas
// que venden; artículos y minijuegos siguen solo en español (próximo paso:
// traducirlo todo). Ver marca-personal/ux-ui/ingles.md.

export type Lang = 'es' | 'en';

export const getLang = (pathname: string): Lang => (pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'es');

// Páginas que ya existen en inglés: ruta española → ruta inglesa. Solo las que
// están aquí llevan hreflang y el selector salta a su pareja; el resto del
// selector lleva a la home del otro idioma, y los enlaces de la versión inglesa
// a páginas aún sin traducir caen en la española.
// Slugs ingleses de las áreas (mismo identificador que en español).
export const AREA_EN: Record<string, string> = {
  'estrategia-y-marca': 'strategy-and-brand',
  'diseno-web': 'web-design',
  'seo-geo': 'seo-geo',
  'publicidad-online': 'online-advertising',
  'redes-sociales': 'social-media',
  eventos: 'events',
};
// Fichas de consultoría: slug español → inglés.
export const FICHA_EN: Record<string, string> = {
  pipeline: 'pipeline-audit',
  'gtm-icp': 'go-to-market',
  posicionamiento: 'brand-positioning',
  'mentoria-comunicacion': 'media-training',
};
export const CASOS_EN = ['zebra-ventures', 'integra', 'broco', 'muebles-rey', 'muebles-tuco', 'slm'];

export const RUTAS_EN: Record<string, string> = {
  '/': '/en/',
  '/servicios/': '/en/services/',
  ...Object.fromEntries(Object.entries(AREA_EN).map(([es, en]) => [`/servicios/${es}/`, `/en/services/${en}/`])),
  ...Object.fromEntries(Object.entries(FICHA_EN).map(([es, en]) => [`/servicios/${es}/`, `/en/services/${en}/`])),
  '/trabajo/': '/en/case-studies/',
  ...Object.fromEntries(CASOS_EN.map((c) => [`/trabajo/${c}/`, `/en/case-studies/${c}/`])),
  '/quienes-somos/': '/en/about/',
  '/contacto/': '/en/contact/',
  '/recomendador/': '/en/recommender/',
  '/privacidad/': '/en/privacy/',
};
const RUTAS_ES = Object.fromEntries(Object.entries(RUTAS_EN).map(([es, en]) => [en, es]));

const conBarra = (p: string) => (p.endsWith('/') ? p : `${p}/`);

/** Pareja de una página en el otro idioma, o null si no existe. */
export const pareja = (pathname: string): string | null => {
  const p = conBarra(pathname);
  return getLang(p) === 'en' ? RUTAS_ES[p] ?? null : RUTAS_EN[p] ?? null;
};

/** Destino del selector de idioma: la pareja si existe, si no la home del otro idioma. */
export const destinoSelector = (pathname: string): string => pareja(pathname) ?? (getLang(pathname) === 'en' ? '/' : '/en/');

/** Enlace interno en el idioma de la página: la versión inglesa si existe, si no la española. */
export const enlace = (lang: Lang, rutaEs: string): string => {
  if (lang === 'es') return rutaEs;
  const [base, ancla] = rutaEs.split('#');
  const en = RUTAS_EN[conBarra(base)];
  return en ? `${en}${ancla ? `#${ancla}` : ''}` : rutaEs;
};

export const UI = {
  es: {
    saltar: 'Saltar al contenido',
    prepro: 'Preproducción · copia de pruebas, no es la web oficial',
    menu: { servicios: 'Servicios', casos: 'Casos reales', quienes: 'Quiénes somos', recursos: 'Recursos', contacto: 'Contacto', reco: '¿Qué necesitas?', abrir: 'Abrir menú', cerrar: 'Cerrar menú', oscuro: 'Activar modo oscuro', claro: 'Activar modo claro', idioma: 'Ver en inglés', idiomaCorto: 'EN', nombresRecursos: {} as Record<string, string> },
    pie: { servicios: 'Servicios', casos: 'Casos reales', recursos: 'Recursos', hablemos: 'Hablemos', quienes: 'Quiénes somos', contacto: 'Contacto', llamada: 'Reservar llamada de 15 min', diagTitulo: '¿Qué hay detrás de tus ventas?', diagTexto: 'Haz el autodiagnóstico en 3 minutos y llévate tus tres primeros pasos.', diagBoton: 'Empezar diagnóstico', copy: 'Zaragoza (España)', privacidad: 'Privacidad', cookies: 'Preferencias de cookies', inicio: 'GBT Consultoría, ir a la página de inicio' },
    contacto: { llamada: 'Reservar llamada', escribe: 'Escríbeme' },
    siguenos: { texto: 'Síguenos', aria: 'Síguenos en redes sociales', en: 'GBT Consultoría en' },
    foto: 'Foto pendiente',
    burbuja: { texto: '¿Te ayudamos a elegir qué necesitas?', cerrar: 'Cerrar' },
    casos: { titulo: 'Casos reales, resultados reales', todos: 'Ver todos los casos', ver: 'Ver el caso', aria: 'Casos reales', anterior: 'Caso anterior', siguiente: 'Caso siguiente', fotoCaso: (c: string) => `Foto del caso de ${c}: una campaña o una pieza real. Horizontal 4:3.` },
    areas: { incluye: 'Ver qué incluye', servicios: 'Ver servicios', todo: (a: string) => `Todo sobre ${a.toLowerCase()}`, aria: (a: string) => `Servicios de ${a}` },
    marcas: 'Marcas en la trayectoria de Guillén Bruna',
    cookies: { aria: 'Aviso de cookies', texto: 'Usamos Google Analytics para saber qué contenido es útil. No se activa hasta que lo aceptas.', politica: 'Política de privacidad', rechazar: 'Rechazar', aceptar: 'Aceptar' },
  },
  en: {
    saltar: 'Skip to content',
    prepro: 'Staging · test copy, not the official website',
    menu: { servicios: 'Services', casos: 'Case studies', quienes: 'About us', recursos: 'Resources', contacto: 'Contact', reco: 'What do you need?', abrir: 'Open menu', cerrar: 'Close menu', oscuro: 'Switch to dark mode', claro: 'Switch to light mode', idioma: 'Ver en español', idiomaCorto: 'ES', nombresRecursos: { '/articulos/': 'Articles (in Spanish)', '/recursos/minijuegos/': 'Mini-games (in Spanish)' } as Record<string, string> },
    pie: { servicios: 'Services', casos: 'Case studies', recursos: 'Resources (in Spanish)', hablemos: "Let's talk", quienes: 'About us', contacto: 'Contact', llamada: 'Book a 15-minute call', diagTitulo: "What's behind your sales?", diagTexto: 'Take the 3-minute self-assessment (in Spanish) and get your first three steps.', diagBoton: 'Start the assessment', copy: 'Zaragoza (Spain)', privacidad: 'Privacy', cookies: 'Cookie preferences', inicio: 'GBT Consultoría, go to the home page' },
    contacto: { llamada: 'Book a call', escribe: 'Write to us' },
    siguenos: { texto: 'Follow us', aria: 'Follow us on social media', en: 'GBT Consultoría on' },
    foto: 'Photo coming soon',
    burbuja: { texto: 'Shall we help you choose what you need?', cerrar: 'Close' },
    casos: { titulo: 'Real cases, real results', todos: 'See all case studies', ver: 'See the case', aria: 'Case studies', anterior: 'Previous case', siguiente: 'Next case', fotoCaso: (c: string) => `Photo of the ${c} case: a real campaign or piece. Landscape 4:3.` },
    areas: { incluye: "See what's included", servicios: 'See services', todo: (a: string) => `All about ${a.toLowerCase()}`, aria: (a: string) => `${a} services` },
    marcas: "Brands in Guillén Bruna's track record",
    cookies: { aria: 'Cookie notice', texto: 'We use Google Analytics to learn which content is useful. It stays off until you accept it.', politica: 'Privacy policy', rechazar: 'Decline', aceptar: 'Accept' },
  },
} as const;

export const ui = (lang: Lang) => UI[lang];
