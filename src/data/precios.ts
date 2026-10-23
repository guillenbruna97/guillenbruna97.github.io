// Formato de cada servicio de consultoría (duración, dedicación, garantía) y
// sus precios de referencia para las propuestas. Desde el 2026-10-22 la web NO
// publica importes: todo va por propuesta. ServiceLayout solo pinta el
// formato. Los importes (en euros, sin IVA, cerrados el 2026-09-28) se quedan
// aquí como referencia interna; la tarifa inicial se aplica en la propuesta.

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
    noIncluye: ['Ejecutar campañas, redes o anuncios, que nuestra red hace como servicio aparte', 'Implantar el CRM'],
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
    noIncluye: ['Diseño gráfico, logotipo y web, que nuestra red hace como servicio aparte', 'Gestión de campañas'],
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
