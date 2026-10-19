export const CONTACT_EMAIL = 'guillenbrunatricas@gmail.com';
export const BOOKING_URL = 'https://cal.com/guillen-bruna-tricas/15min';
export const LINKEDIN_URL = 'https://www.linkedin.com/in/guillenbruna';
export const LINKEDIN_HANDLE = 'linkedin.com/in/guillenbruna';
export const MAILTO_URL = `mailto:${CONTACT_EMAIL}`;
export const GA_MEASUREMENT_ID = 'G-Z0EQXT8EDV';

// Fuente única de los 4 servicios: cada uno vive en /servicios/<slug>/
// (ver src/pages/servicios/) y se referencia por `slug` desde el
// frontmatter `service` de los artículos (ArticleLayout.astro) y desde
// el desplegable del nav (Nav.astro).
export interface ServiceInfo {
  slug: string;
  name: string;
  tagline: string;
  /** Término que se busca: título de la página y H1. El nombre comercial (`name`) se usa en el resto de la web. */
  seoTitle: string;
}

export const SERVICES: ServiceInfo[] = [
  {
    slug: 'pipeline',
    name: 'Diagnóstico de Pipeline B2B',
    seoTitle: 'Diagnóstico comercial y de pipeline B2B',
    tagline: 'Localiza en qué etapa de tu proceso comercial se pierden las oportunidades y por qué.',
  },
  {
    slug: 'gtm-icp',
    name: 'Estrategia Go-to-Market e ICP',
    seoTitle: 'Estrategia go to market y cliente ideal B2B',
    tagline: 'Define a quién le vendes y por qué canales debes llegar a él.',
  },
  {
    slug: 'posicionamiento',
    name: 'Posicionamiento y Narrativa de Producto',
    seoTitle: 'Posicionamiento de marca y propuesta de valor B2B',
    tagline: 'Convierte tu propuesta de valor técnica en un mensaje que se entiende y convence.',
  },
  {
    slug: 'mentoria-comunicacion',
    name: 'Mentoría de Comunicación Ejecutiva',
    seoTitle: 'Media training y comunicación para directivos',
    tagline: 'Prepara al comité de dirección para hablar en público con criterio estratégico.',
  },
];

export const getService = (slug?: string) => SERVICES.find((s) => s.slug === slug);

// Secciones de /recursos/: alimentan el desplegable del nav y el índice
// de src/pages/recursos/index.astro. Artículos mantiene su URL histórica
// (/articulos/) para no perder lo que Google ya tiene indexado.
export interface ResourceSection {
  href: string;
  name: string;
  tagline: string;
}

export const RESOURCES: ResourceSection[] = [
  {
    href: '/articulos/',
    name: 'Artículos',
    tagline: 'Posicionamiento, marca, go-to-market y comunicación para quien toma las decisiones.',
  },
  {
    href: '/recursos/minijuegos/',
    name: 'Minijuegos',
    tagline: 'Minijuegos de marketing para directivos. Pon a prueba tu visión estratégica con retos que te harán pensar.',
  },
];

// Minijuegos publicados en /recursos/minijuegos/<slug>/. Para añadir uno
// nuevo basta con crear su página y una entrada aquí: el listado de
// /recursos/minijuegos/ se genera a partir de este array.
export interface GameInfo {
  slug: string;
  name: string;
  tag: string;
  excerpt: string;
  // Portada: la tarjeta de /recursos/minijuegos/ la pinta optimizada desde
  // src/assets/minijuegos/ y la página del juego la usa como imagen OG
  // (URL pública en public/images/minijuegos/).
  image: string;
  imageAlt: string;
  meta: string;
  cta: string;
}

export const GAMES: GameInfo[] = [
  {
    slug: 'diagnostico-marketing',
    name: 'Diagnóstico de marketing para directivos',
    tag: 'Autodiagnóstico',
    excerpt: 'Doce preguntas sobre cómo vende hoy tu empresa. Descubre qué hay detrás de lo que notas en las ventas y cuáles son tus tres primeros pasos.',
    image: '/images/minijuegos/diagnostico-marketing.jpg',
    imageAlt: 'Ilustración de un directivo que ausculta con un estetoscopio un bocadillo de diálogo, como metáfora del diagnóstico de marketing',
    meta: '12 preguntas · 3 minutos',
    cta: 'Empezar diagnóstico',
  },
  {
    slug: 'pizzeria-b2b',
    name: 'La pizzería B2B',
    tag: 'Proceso comercial',
    excerpt: 'El juego que te ayuda a ver en qué fase de tu proceso comercial flaqueas. Atiende a un cliente del cartel de la calle al postre y descubre qué claves se te escapan.',
    image: '/images/minijuegos/pizzeria-b2b.jpg',
    imageAlt: 'Ilustración de un pizzero que ve caer una porción de la pizza, como metáfora de la fase del proceso comercial que se escapa',
    meta: '3 niveles · 4 minutos',
    cta: 'Abrir la pizzería',
  },
];

// Envío de los leads del autodiagnóstico al CRM (HubSpot gratuito) por
// la Forms API pública, sin scripts de HubSpot en la web. Los IDs no son
// secretos: viajan igualmente en cualquier formulario incrustado.
// Mientras HUBSPOT_PORTAL_ID o HUBSPOT_FORM_ID estén vacíos el diagnóstico
// funciona igual pero NO guarda el lead (avisa por consola).
export const HUBSPOT_PORTAL_ID = '149544949';
export const HUBSPOT_FORM_ID = 'd6b840dc-a0b8-44e3-8074-c60ba91de19b';
// ID del tipo de suscripción de marketing (Configuración > Marketing >
// Email > Tipos de suscripción). Con él HubSpot registra el consentimiento
// comercial en la ficha del contacto.
export const HUBSPOT_SUBSCRIPTION_TYPE_ID = '3864981948';

// Textos de las casillas de consentimiento de los formularios que envían a
// HubSpot (autodiagnóstico y minijuegos). Se envían literalmente como prueba
// de qué aceptó cada contacto, así que si cambian aquí cambian también en el
// registro de consentimiento.
export const LEAD_TEXTO_PRIVACIDAD = 'He leído y acepto la política de privacidad.';
export const LEAD_TEXTO_COMERCIAL = 'Quiero recibir por email contenidos y propuestas comerciales de Guillén Bruna. Puedes darte de baja cuando quieras.';
