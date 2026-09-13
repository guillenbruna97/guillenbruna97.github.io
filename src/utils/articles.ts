export const categoryOf = (tag: string) => tag.split('·')[0].trim();

export const slugify = (value: string) =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

interface ArticuloLike {
  id: string;
  data: { tag: string; date: Date };
}

// Prioriza artículos de la misma categoría (misma parte antes del "·" en
// `tag`); si no hay suficientes, completa con los más recientes del resto.
// Varias categorías hoy solo tienen 1 artículo, así que el relleno es la
// norma, no la excepción.
export function getRelatedArticles<T extends ArticuloLike>(all: T[], current: T, count = 3): T[] {
  const category = categoryOf(current.data.tag);
  const byDateDesc = (a: T, b: T) => b.data.date.valueOf() - a.data.date.valueOf();
  const others = all.filter((a) => a.id !== current.id);
  const sameCategory = others.filter((a) => categoryOf(a.data.tag) === category).sort(byDateDesc);
  const rest = others.filter((a) => categoryOf(a.data.tag) !== category).sort(byDateDesc);
  return [...sameCategory, ...rest].slice(0, count);
}
