// Categorías del blog: fuente única de verdad para filtros, páginas de
// categoría y artículos relacionados. Cada una ataca una familia de keywords
// alineada con un servicio de la web. El orden aquí es el orden de los filtros.
//
// `aliases` recoge prefijos antiguos o previsibles de `tag` (la rutina
// automática de artículos puede seguir escribiéndolos): se reasignan a la
// categoría canónica en vez de crear una categoría nueva de 1 artículo.
// Un prefijo desconocido cae en Marketing.
export interface Category {
  nombre: string;
  slug: string;
  metaTitle: string;
  heading: string;
  description: string;
  aliases: string[];
}

export const CATEGORIES: Category[] = [
  {
    nombre: 'Marketing',
    slug: 'marketing',
    metaTitle: 'Artículos de estrategia de marketing',
    heading: 'Ideas sobre estrategia de marketing',
    description: 'Estrategia de marketing para empresas y directivos. Foco, retorno a largo plazo y cuándo contar con un consultor externo en lugar de sumar más ejecución.',
    aliases: ['estrategia de marketing', 'consultoria'],
  },
  {
    nombre: 'Marca',
    slug: 'marca',
    metaTitle: 'Estrategia de marca y posicionamiento',
    heading: 'Ideas sobre estrategia de marca y posicionamiento',
    description: 'Estrategia de marca y posicionamiento B2B. Diagnóstico, coherencia entre canales online y offline y cómo se convierte una empresa en referente de su sector.',
    aliases: ['branding', 'posicionamiento'],
  },
  {
    nombre: 'Comunicación',
    slug: 'comunicacion',
    metaTitle: 'Comunicación directiva y marca personal',
    heading: 'Ideas sobre comunicación directiva y marca personal',
    description: 'Comunicación directiva y marca personal para CEO y fundadores. Medios, crisis, LinkedIn y cómo preparar al comité de dirección para hablar con autoridad.',
    aliases: ['marca personal', 'comunicacion directiva', 'mentoria'],
  },
  {
    nombre: 'Go-to-market',
    slug: 'go-to-market',
    metaTitle: 'Go-to-market y ventas B2B',
    heading: 'Ideas sobre go-to-market y ventas B2B',
    description: 'Go-to-market y ventas B2B. Lanzamiento de producto SaaS, propuesta de valor, diferenciación y diagnóstico del proceso comercial que alimenta el pipeline.',
    aliases: ['gtm', 'pipeline', 'ventas', 'saas'],
  },
  {
    nombre: 'IA en marketing',
    slug: 'ia-en-marketing',
    metaTitle: 'IA en marketing y visibilidad en IA',
    heading: 'Ideas sobre IA en marketing y visibilidad en buscadores',
    description: 'IA aplicada al marketing. Cómo medir si ChatGPT o Google AI Overviews citan a tu empresa, qué exige el reglamento europeo y dónde la IA no sustituye estrategia.',
    aliases: ['ia', 'ia aplicada', 'seo', 'geo', 'visibilidad en ia'],
  },
];

export const slugify = (value: string) =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const categoryByKey = new Map<string, Category>(
  CATEGORIES.flatMap((category) => [
    [slugify(category.nombre), category] as const,
    ...category.aliases.map((alias) => [slugify(alias), category] as const),
  ])
);

export const categoryFor = (tag: string): Category =>
  categoryByKey.get(slugify(tag.split('·')[0])) ?? CATEGORIES[0];

export const categoryOf = (tag: string) => categoryFor(tag).nombre;

// Etiqueta que se muestra en cards y cabecera de artículo: siempre con el
// nombre canónico de la categoría, aunque el frontmatter use un alias.
export const displayTag = (tag: string) => {
  const [, ...rest] = tag.split('·');
  const sub = rest.join('·').trim();
  return sub ? `${categoryOf(tag)} · ${sub}` : categoryOf(tag);
};

// Solo las categorías que tienen al menos un artículo, en el orden de CATEGORIES.
export const activeCategories = (tags: string[]) => {
  const used = new Set(tags.map(categoryOf));
  return CATEGORIES.filter((category) => used.has(category.nombre));
};

interface ArticuloLike {
  id: string;
  data: { tag: string; date: Date };
}

// Prioriza artículos de la misma categoría; si no hay suficientes, completa
// con los más recientes del resto.
export function getRelatedArticles<T extends ArticuloLike>(all: T[], current: T, count = 3): T[] {
  const category = categoryOf(current.data.tag);
  const byDateDesc = (a: T, b: T) => b.data.date.valueOf() - a.data.date.valueOf();
  const others = all.filter((a) => a.id !== current.id);
  const sameCategory = others.filter((a) => categoryOf(a.data.tag) === category).sort(byDateDesc);
  const rest = others.filter((a) => categoryOf(a.data.tag) !== category).sort(byDateDesc);
  return [...sameCategory, ...rest].slice(0, count);
}
