import nextRouters, { attributes as nextRoutersMeta } from './next-routers.md';

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
];

export default articles;
