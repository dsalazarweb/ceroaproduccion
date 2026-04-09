import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';

export async function GET(context) {
  const labs = await getCollection('labs');
  const guias = await getCollection('guias');
  
  const items = [...labs, ...guias]
    .filter(item => !item.data.draft)
    .sort((a, b) => b.data.fecha - a.data.fecha)
    .map(item => ({
      title: item.data.titulo,
      pubDate: item.data.fecha,
      description: item.data.descripcion,
      link: `/${item.collection}/${item.id}/`,
    }));

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items,
  });
}
