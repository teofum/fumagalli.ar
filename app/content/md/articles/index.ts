import nextRouters, { attributes as nextRoutersMeta } from './next-routers.md';
import nikonD7000, { attributes as nikonD7000Meta } from './nikon-d7000.md';

interface Post {
  slug: string;
  title: string;
  date: Date;
  Component: typeof nextRouters;
}

const articles: Post[] = [
  {
    slug: nextRoutersMeta.slug,
    title: nextRoutersMeta.title,
    date: nextRoutersMeta.date,
    Component: nextRouters,
  },
  {
    slug: nikonD7000Meta.slug,
    title: nikonD7000Meta.title,
    date: nikonD7000Meta.date,
    Component: nikonD7000,
  },
];

export default articles;
