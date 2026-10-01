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
}

export const PRECIOS: Precio[] = [
  {
    slug: 'pipeline',
    desde: 3500,
    hasta: 5000,
    rango: 'Hasta 5.000 € con varias líneas de negocio o más de un equipo comercial',
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
  descuento: 'Si contratas un proyecto en los 30 días siguientes, los 650 € se descuentan de su precio',
};

export const getPrecio = (slug?: string) => PRECIOS.find((p) => p.slug === slug);

export const euros = (n: number) => `${n.toLocaleString('es-ES', { useGrouping: 'always' } as Intl.NumberFormatOptions)} €`;
