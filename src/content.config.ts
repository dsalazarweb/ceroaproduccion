import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const labs = defineCollection({
  loader: glob({ base: './src/content/labs', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    titulo: z.string(),
    descripcion: z.string(),
    fecha: z.coerce.date(),
    fase: z.number(),
    dia: z.number(),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
  }),
});

const guias = defineCollection({
  loader: glob({ base: './src/content/guias', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    titulo: z.string(),
    descripcion: z.string(),
    fecha: z.coerce.date(),
    tags: z.array(z.string()),
    dificultad: z.enum(['principiante', 'intermedio', 'avanzado']),
    tiempo_lectura: z.number().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { labs, guias };
