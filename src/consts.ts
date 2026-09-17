export const CONTACT_EMAIL = 'guillenbrunatricas@gmail.com';
export const BOOKING_URL = 'https://cal.com/guillen-bruna-tricas/15min';
export const LINKEDIN_URL = 'https://www.linkedin.com/in/guillenbruna';
export const LINKEDIN_HANDLE = 'linkedin.com/in/guillenbruna';
export const MAILTO_URL = `mailto:${CONTACT_EMAIL}`;

// Anclas de /servicios/ (ver src/pages/servicios/index.astro) y su nombre
// visible, usadas por el frontmatter `service` de cada artículo para
// enlazar hacia el servicio relacionado (ver ArticleLayout.astro).
export const SERVICES: Record<string, string> = {
  pipeline: 'Diagnóstico de Pipeline B2B',
  'gtm-icp': 'Estrategia Go-to-Market e ICP',
  posicionamiento: 'Posicionamiento y Narrativa de Producto',
  'mentoria-comunicacion': 'Mentoría de Comunicación Ejecutiva',
};
