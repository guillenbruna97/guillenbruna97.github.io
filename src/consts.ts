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
}

export const SERVICES: ServiceInfo[] = [
  {
    slug: 'pipeline',
    name: 'Diagnóstico de Pipeline B2B',
    tagline: 'Localiza en qué etapa de tu proceso comercial se pierden las oportunidades y por qué.',
  },
  {
    slug: 'gtm-icp',
    name: 'Estrategia Go-to-Market e ICP',
    tagline: 'Define a quién le vendes y unifica el mensaje en todos tus canales.',
  },
  {
    slug: 'posicionamiento',
    name: 'Posicionamiento y Narrativa de Producto',
    tagline: 'Convierte tu propuesta de valor técnica en un mensaje que se entiende y convence.',
  },
  {
    slug: 'mentoria-comunicacion',
    name: 'Mentoría de Comunicación Ejecutiva',
    tagline: 'Prepara al comité de dirección para hablar en público con criterio estratégico.',
  },
];

export const getService = (slug?: string) => SERVICES.find((s) => s.slug === slug);
