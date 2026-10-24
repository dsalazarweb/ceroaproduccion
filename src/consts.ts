export const SITE_TITLE = 'Cero a Producción';
export const SITE_DESCRIPTION = 'DevOps y Cloud en español — guías reales, errores reales, desde cero hasta producción.';
export const SITE_URL = 'https://ceroaproduccion.dev';
export const AUTHOR = 'Diego Salazar';
export const AUTHOR_GITHUB = 'https://github.com/dsalazarweb/ceroaproduccion';
export const AUTHOR_LINKEDIN = 'https://www.linkedin.com/in/diego-salazar-a77a54100';

// Dominio personalizado o genérico de Cloudflare R2 para servir imágenes estáticas de los Labs
// Reemplazar cuando se conecte el bucket R2 a un dominio (ej: media.ceroaproduccion.dev)
export const R2_DOMAIN = '';

export interface SerieInfo {
  titulo: string;
  total: number;
  descripcion: string;
}

export const SERIES_CONFIG: Record<string, SerieInfo> = {
  'devops-en-windows': {
    titulo: 'DevOps en Windows',
    total: 4,
    descripcion: '4 guías desde la instalación hasta producción',
  },
  'git-desde-cero': {
    titulo: 'Git desde Cero',
    total: 3,
    descripcion: '3 guías para dominar Git desde los fundamentos hasta buenas prácticas',
  },
};
 
