// Fuente única de precio y formato de cada servicio. La usan el bloque
// "Precio y formato" de ServiceLayout, la tabla de /como-trabajo/ y el schema
// Offer. Importes en euros y siempre sin IVA. Cerrados el 2026-09-28 (ver
// agents-library/agents/seo-ai-system/your-site/condiciones-servicio.md).

export interface Precio {
  slug: string;
  desde: number;
  hasta?: number;
  /** Qué hace que el precio suba de `desde` a `hasta`. */
  rango?: string;
  /** Unidad de cobro cuando no es un proyecto cerrado. */
  unidad?: string;
  duracion: string;
  dedicacion: string;
  pago: string;
  garantia?: string;
  noIncluye: string[];
  /** Formato de entrada más corto, si existe. */
  extra?: { label: string; precio: number };
  /** Precio de lanzamiento, vigente hasta LANZAMIENTO.hasta. Mismos campos que el precio normal. */
  /** Precio de un comité de tres directivos (solo mentoría). */
  comite?: number;
  lanzamiento?: { desde: number; hasta?: number; rango?: string; extra?: number; comite?: number };
}

// Tarifa inicial (en el código, «lanzamiento»): decidida por Dirección el 2026-10-11.
// Se aplica al PRIMER proyecto con cada empresa que contrate hasta la fecha indicada,
// incluida; desde el segundo proyecto, tarifa normal. Tras la fecha, la web vuelve sola
// a la tarifa normal en el primer build posterior.
export const LANZAMIENTO = {
  hasta: '2027-03-31',
  etiqueta: 'Tarifa inicial para el primer proyecto con tu empresa',
  condicion: 'contratando hasta el 31 de marzo de 2027',
};

export const PRECIOS: Precio[] = [
  {
    slug: 'pipeline',
    desde: 3500,
    hasta: 5000,
    rango: 'Hasta 5.000 € con varias líneas de negocio o más de un equipo comercial',
    lanzamiento: { desde: 1800, hasta: 2500, rango: 'Hasta 2.500 € con varias líneas de negocio o más de un equipo comercial' },
    duracion: '3 semanas',
    dedicacion: 'Unas 4 horas tuyas y 45 minutos con cada uno de 2 o 3 comerciales',
    pago: '50 % al empezar y 50 % en la entrega',
    garantia: 'El 50 % final solo se paga si el informe documenta al menos 3 fugas con datos de tu CRM, cada una con su acción priorizada',
    noIncluye: ['Implantar o cambiar el CRM', 'Formar al equipo de ventas', 'Generar leads'],
  },
  {
    slug: 'gtm-icp',
    desde: 6500,
    hasta: 9000,
    rango: 'Hasta 9.000 € con más de un mercado o línea de producto',
    lanzamiento: { desde: 3000, hasta: 4500, rango: 'Hasta 4.500 € con más de un mercado o línea de producto' },
    duracion: '6 semanas',
    dedicacion: 'Unas 8 horas del equipo entre entrevistas y dos talleres de validación',
    pago: '50 % al empezar y 50 % en la entrega',
    noIncluye: ['Ejecutar campañas', 'Gestionar redes o anuncios', 'Implantar CRM'],
  },
  {
    slug: 'posicionamiento',
    desde: 4500,
    hasta: 6500,
    rango: 'Hasta 6.500 € con más de dos segmentos de cliente',
    lanzamiento: { desde: 2200, hasta: 3000, rango: 'Hasta 3.000 € con más de dos segmentos de cliente' },
    duracion: '4 semanas',
    dedicacion: 'Unas 5 horas tuyas entre entrevista inicial, validación y revisión final',
    pago: '50 % al empezar y 50 % en la entrega',
    garantia: 'Dos rondas de revisión incluidas',
    noIncluye: ['Diseño gráfico o logotipo', 'Maquetación de la web', 'Gestión de campañas'],
  },
  {
    slug: 'mentoria-comunicacion',
    desde: 2800,
    unidad: 'por directivo y trimestre',
    rango: 'Comité de tres directivos 7.200 € por trimestre',
    comite: 7200,
    lanzamiento: { desde: 1500, rango: 'Comité de tres directivos 3.900 € por trimestre', extra: 350, comite: 3900 },
    duracion: '3 meses con 6 sesiones de 90 minutos',
    dedicacion: 'Las sesiones y la preparación de cada intervención',
    pago: 'Por trimestre adelantado',
    garantia: 'Apoyo entre sesiones para intervenciones urgentes con respuesta en 24 horas laborables',
    noIncluye: ['Redactar discursos completos en tu nombre', 'Gestionar la relación con prensa'],
    extra: { label: 'Intervención puntual con sesión de 2 horas y nota de decisión', precio: 650 },
  },
];

// Puerta de entrada a los servicios de consultoría (pipeline, gtm-icp y
// posicionamiento). Mentoría tiene la suya propia en `extra`. Decidida el
// 2026-10-01: 2 horas + nota escrita, 650 € + IVA, descontable del proyecto.
export const SESION_DIAGNOSTICO = {
  precio: 650,
  nombre: 'Sesión de diagnóstico',
  formato: 'Sesión de 2 horas sobre tu caso y una nota escrita con el problema principal, tres prioridades y qué servicio encaja, o si no encaja ninguno',
  descuento: 'Si contratas un proyecto en los 30 días siguientes, se descuenta de su precio',
  lanzamiento: 250,
};

export const getPrecio = (slug?: string) => PRECIOS.find((p) => p.slug === slug);

/** true mientras duran los precios de lanzamiento (se evalúa en cada build). */
export const enLanzamiento = (hoy = new Date()) => hoy.toISOString().slice(0, 10) <= LANZAMIENTO.hasta;

/** Precio que se cobra hoy, con el normal en `normal` si hay lanzamiento (para tacharlo). */
export const vigente = (p: Precio) => {
  if (!enLanzamiento() || !p.lanzamiento) return { ...p, normal: undefined as Precio | undefined };
  const l = p.lanzamiento;
  return {
    ...p,
    desde: l.desde,
    hasta: l.hasta,
    rango: l.rango ?? p.rango,
    extra: p.extra && { ...p.extra, precio: l.extra ?? p.extra.precio },
    comite: l.comite ?? p.comite,
    normal: p,
  };
};

/** Precio de la sesión de diagnóstico que se cobra hoy, y el normal si hay lanzamiento. */
export const diagnosticoVigente = () =>
  enLanzamiento()
    ? { precio: SESION_DIAGNOSTICO.lanzamiento, normal: SESION_DIAGNOSTICO.precio as number | undefined }
    : { precio: SESION_DIAGNOSTICO.precio, normal: undefined as number | undefined };

/** Precio vigente de un servicio por slug. */
export const precioDe = (slug: string) => vigente(getPrecio(slug)!);

export const euros = (n: number) => `${n.toLocaleString('es-ES', { useGrouping: 'always' } as Intl.NumberFormatOptions)} €`;

// Línea «GBT Guillén Bruna»: webs para negocios locales (fisios primero).
// Decidida por Dirección el 2026-10-19. Uso interno y para propuestas: ninguna
// página de esta web la importa. Euros sin IVA. Sin precio de lanzamiento.
// Dominio y alojamiento los gestiona el cliente (se le recomienda dominio .es en
// DonDominio y alojamiento gratis en Cloudflare); si lo gestiona Guillén, es el
// mantenimiento. Lo que se empuja: web, blog y redes. El resto del
// posicionamiento se hace bajo pedido.
export interface PrecioWeb {
  slug: string;
  nombre: string;
  precio: number;
  unidad: 'pago único' | 'al mes' | 'por unidad';
  incluye: string;
  /** false = no se ofrece de entrada, solo si el cliente lo pide. */
  seOfrece: boolean;
  nota?: string;
}

export const PRECIOS_WEBS_NEGOCIOS: PrecioWeb[] = [
  { slug: 'web', nombre: 'Web', precio: 1200, unidad: 'pago único', seOfrece: true,
    nota: 'Precio de partida para las tres primeras clínicas (2026-10-19): en la llamada se pregunta antes cuánto pensaban invertir y se ajusta con esas respuestas',
    incluye: 'Web con la identidad del negocio, textos SEO y GEO, sección de blog, sesión de fotos y vídeo en la entrega, ficha de Google puesta a punto y enlazada, 30 días de ajustes y guía para dejar dominio y alojamiento a su nombre' },
  { slug: 'blog-2', nombre: 'Blog 2', precio: 320, unidad: 'al mes', seOfrece: true,
    incluye: '2 artículos al mes sobre búsquedas reales (900-1.200 palabras, FAQ con schema, enlaces internos, imagen y publicación) + informe mensual. Mantenimiento incluido' },
  { slug: 'blog-4', nombre: 'Blog 4', precio: 580, unidad: 'al mes', seOfrece: true,
    incluye: '4 artículos al mes + informe mensual. Mantenimiento incluido', nota: 'Para centros con varios servicios que posicionar' },
  { slug: 'redes', nombre: 'Redes sociales', precio: 490, unidad: 'al mes', seOfrece: true,
    incluye: '1 vídeo, 1 carrusel y 1 historia a la semana, con un rodaje de 3-4 horas en el centro cada 2 meses (8 vídeos por rodaje). Mantenimiento incluido' },
  { slug: 'articulo', nombre: 'Artículo suelto', precio: 140, unidad: 'por unidad', seOfrece: true,
    incluye: 'Un artículo de blog publicado, sin informe' },
  { slug: 'informe', nombre: 'Informe mensual', precio: 60, unidad: 'al mes', seOfrece: true,
    incluye: 'Posiciones, visitas, llamadas y reservas desde la web, y qué hacer el mes siguiente', nota: 'Solo junto al blog' },
  { slug: 'rodaje-extra', nombre: 'Rodaje extra', precio: 150, unidad: 'por unidad', seOfrece: true,
    incluye: 'Una visita de grabación fuera del calendario de cada 2 meses' },
  { slug: 'mantenimiento', nombre: 'Mantenimiento web', precio: 120, unidad: 'al mes', seOfrece: true,
    incluye: 'Dominio, alojamiento, avisos de renovación y hasta un cambio pequeño al mes', nota: 'Solo si no hay ningún plan mensual; con plan va incluido' },
  { slug: 'blog-alta', nombre: 'Alta del blog', precio: 250, unidad: 'pago único', seOfrece: false,
    incluye: 'Sección de blog en una web que no ha hecho Guillén' },
  { slug: 'ficha-google-alta', nombre: 'Puesta a punto de la ficha de Google', precio: 250, unidad: 'pago único', seOfrece: false,
    incluye: 'Categorías, servicios, atributos, fotos y descripción', nota: 'Incluida en la web' },
  { slug: 'ficha-google-publicaciones', nombre: 'Publicaciones en la ficha de Google', precio: 120, unidad: 'al mes', seOfrece: false,
    incluye: '4 publicaciones al mes' },
  { slug: 'resenas', nombre: 'Gestión de reseñas', precio: 100, unidad: 'al mes', seOfrece: false,
    incluye: 'Sistema para pedirlas a los pacientes y respuesta a todas' },
  { slug: 'directorios', nombre: 'Alta y limpieza en directorios', precio: 300, unidad: 'pago único', seOfrece: false,
    incluye: 'Doctoralia, Top Doctors, Páginas Amarillas y similares, con nombre, dirección y teléfono iguales en todos' },
  { slug: 'auditoria-seo', nombre: 'Auditoría SEO y plan', precio: 400, unidad: 'pago único', seOfrece: false,
    incluye: 'Revisión técnica y de contenido de una web existente con plan priorizado' },
  { slug: 'pagina-optimizada', nombre: 'Optimización de una página existente', precio: 90, unidad: 'por unidad', seOfrece: false,
    incluye: 'Título, descripción, encabezados, texto y schema de una página' },
  { slug: 'enlaces-locales', nombre: 'Enlace local conseguido', precio: 150, unidad: 'por unidad', seOfrece: false,
    incluye: 'Mención con enlace en un medio, asociación o negocio local', nota: 'Se cobra solo si se consigue' },
  { slug: 'visibilidad-ia', nombre: 'Informe de visibilidad en IA', precio: 150, unidad: 'por unidad', seOfrece: false,
    incluye: 'Qué responden ChatGPT, Gemini y Perplexity cuando se pregunta por el servicio en la zona, y qué cambiar', nota: 'Trimestral' },
  { slug: 'posicionamiento-completo', nombre: 'Posicionamiento completo', precio: 540, unidad: 'al mes', seOfrece: false,
    incluye: 'Blog 2 + publicaciones en la ficha de Google + gestión de reseñas + informe. Mantenimiento incluido' },
];
