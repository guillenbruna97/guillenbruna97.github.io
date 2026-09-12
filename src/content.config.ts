import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articulos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articulos' }),
  schema: z.object({
    title: z.string(),
    tag: z.string(),
    excerpt: z.string(),
    description: z.string(),
    date: z.date(),
    readingTime: z.string(),
    image: z.string().optional(),
    // Opcional a propósito: la rutina automática semanal (rutina-quincenal.yml)
    // genera artículos nuevos sin este campo, y no debe romper el build si
    // no lo incluye. ArticleLayout/ArticlesListing hacen fallback al título
    // cuando no está presente.
    imageAlt: z.string().optional(),
  }),
});

export const collections = { articulos };
