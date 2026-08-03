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
  }),
});

export const collections = { articulos };
