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
    // Última revisión significativa del cuerpo (estructura, secciones, fuentes).
    // No se rellena por retoques de title/description ni por cambiar un enlace:
    // alimenta dateModified del schema, el "Actualizado" visible y el <lastmod>
    // del sitemap (astro.config.mjs), y Google pide que refleje cambios reales.
    updated: z.date().optional(),
    readingTime: z.string(),
    image: z.string().optional(),
    // Opcional a propósito: la rutina automática semanal (rutina-quincenal.yml)
    // genera artículos nuevos sin este campo, y no debe romper el build si
    // no lo incluye. ArticleLayout/ArticlesListing hacen fallback al título
    // cuando no está presente.
    imageAlt: z.string().optional(),
    // Ancla del servicio relacionado en /servicios/ (ver src/consts.ts SERVICES).
    // Opcional: la rutina automática semanal no lo rellena y no debe romper el build.
    service: z.string().optional(),
    // Título corto (<=60 caracteres sumando " | Guillén Bruna Tricas") solo para
    // la etiqueta <title>, evitando que se trunque en Google. El H1 y el título
    // editorial (más largo y evocador, `title`) no cambian. Opcional: si falta,
    // ArticleLayout usa `title` como fallback.
    seoTitle: z.string().optional(),
  }),
});

export const collections = { articulos };
