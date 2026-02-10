import { articleSchema } from '@/schemas/article';
import { sanityClient } from '@/utils/sanity.server';

const dateCompareFn = (a: { date: Date }, b: { date: Date }) => {
  return b.date.getTime() - a.date.getTime();
};

const ARTICLES_QUERY = `
*[_type == "article"] {
  ...,
  legacyDate,
  'fileDate': file->_createdAt,
}`;

export default async function fetchArticles() {
  const data = articleSchema
    .array()
    .parse(await sanityClient.fetch(ARTICLES_QUERY));

  const articles = data.map(({ fileDate, legacyDate, ...article }) => ({
    ...article,
    date: new Date(legacyDate ?? fileDate),
  }));

  articles.sort(dateCompareFn);

  return articles;
}
