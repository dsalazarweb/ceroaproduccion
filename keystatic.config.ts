import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: {
    // Para WSL local puro, guardamos directamente sobre el repositorio activo
    kind: 'local',
  },
  collections: {
    labs: collection({
      label: 'Labs DevOps',
      slugField: 'titulo',
      path: 'src/content/labs/*',
      format: { contentField: 'content' },
      schema: {
        titulo: fields.slug({ name: { label: 'Título del Lab' } }),
        descripcion: fields.text({ label: 'Descripción breve', multiline: true }),
        fecha: fields.date({ label: 'Fecha de publicación' }),
        fase: fields.integer({ label: 'Fase del Roadmap', defaultValue: 1 }),
        dia: fields.integer({ label: 'Día del reto' }),
        tags: fields.array(
          fields.text({ label: 'Tag' }),
          { label: 'Lista de Tags', itemLabel: props => props.value }
        ),
        imagen: fields.image({
          label: 'Imagen Principal',
          directory: 'public/images',
          publicPath: '/images/',
          validation: { isRequired: false }
        }),
        draft: fields.checkbox({ label: 'Es un borrador / Oculto', defaultValue: false }),
        content: fields.mdx({
          label: 'Contenido del Lab',
          extension: 'md',
          options: {
            image: {
              directory: 'public/images/content',
              publicPath: '/images/content/',
            },
          },
        }),
      },
    }),
    
    guias: collection({
      label: 'Guías de Ingeniería',
      slugField: 'titulo',
      path: 'src/content/guias/*',
      format: { contentField: 'content' },
      schema: {
        titulo: fields.slug({ name: { label: 'Título de la Guía' } }),
        descripcion: fields.text({ label: 'Descripción SEO / Extracto', multiline: true }),
        fecha: fields.date({ label: 'Fecha de publicación' }),
        tags: fields.array(
          fields.text({ label: 'Tag' }),
          { label: 'Lista de Tags', itemLabel: props => props.value }
        ),
        dificultad: fields.select({
          label: 'Dificultad de la guía',
          options: [
            { label: 'Principiante', value: 'principiante' },
            { label: 'Intermedio', value: 'intermedio' },
            { label: 'Avanzado', value: 'avanzado' },
          ],
          defaultValue: 'principiante',
        }),
        tiempo_lectura: fields.integer({ label: 'Tiempo estimado (Minutos)', validation: { isRequired: false } }),
        serie: fields.text({ label: 'Parte de una serie (Nombre)', validation: { isRequired: false } }),
        orden: fields.integer({ label: 'Orden dentro de la serie', validation: { isRequired: false } }),
        imagen: fields.image({
          label: 'Imagen Destacada / Cover',
          directory: 'public/images',
          publicPath: '/images/',
          validation: { isRequired: false }
        }),
        draft: fields.checkbox({ label: 'Modo Borrador', defaultValue: false }),
        content: fields.mdx({
          label: 'Desarrollo de la Guía',
          extension: 'md',
          options: {
            image: {
              directory: 'public/images/content',
              publicPath: '/images/content/',
            },
          },
        }),
      },
    }),
  },
});
