import Link from 'next/link';
import DitherCard from '@/content/mdx/dither/dither.card';
import Dither2Card from '@/content/mdx/dither2/dither2.card';
import { articleSchema } from '@/schemas/article';
import { sanityClient } from '@/utils/sanity.server';

const dateCompareFn = (a: { date: Date }, b: { date: Date }) => {
  return b.date.getTime() - a.date.getTime();
};

const ARTICLES_QUERY = `
*[_type == "article"] {
  _id,
  title,
  slug,
  legacyDate,
  'fileDate': file->_createdAt,
}`;

// Revalidate the page once every hour, this ensures content is reasonably fresh
export const revalidate = 3600;

export default async function PostsIndexRoute() {
  const data = articleSchema
    .array()
    .parse(await sanityClient.fetch(ARTICLES_QUERY));

  const articles = data.map(({ fileDate, legacyDate, ...article }) => ({
    ...article,
    date: new Date(legacyDate ?? fileDate),
  }));

  articles.sort(dateCompareFn);

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-title text-content-4xl sm:text-content-6xl mb-8">
        Writing
      </h1>

      <h2 className="text-content-xl sm:text-content-2xl font-semibold mb-2 mt-8">
        Interactive articles
      </h2>
      <p className="mb-4">
        These are detailed, interactive deep-dives into a topic I find
        interesting.
      </p>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-2">
        <Link href="articles/mdx/introduction-to-dithering">
          <DitherCard />
        </Link>
        <Link href="articles/mdx/dithering-color">
          <Dither2Card />
        </Link>
      </div>

      <h2 className="text-content-xl sm:text-content-2xl font-semibold mb-2 mt-8">
        Other articles
      </h2>

      <ul>
        {articles.map((post) => (
          <li key={post.slug} className="border-t last:border-b">
            <Link
              href={`articles/${post.slug}`}
              className="flex flex-row p-4 gap-4 hover:bg-text/10 transition-colors"
            >
              <span className="w-20">
                {post.date.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                })}
              </span>
              <span className="grow">{post.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
