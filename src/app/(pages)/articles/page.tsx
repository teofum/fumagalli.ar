import Link from 'next/link';
import DitherCard from '@/content/mdx/dither/dither.card';
import Dither2Card from '@/content/mdx/dither2/dither2.card';
import { articleSchema } from '@/schemas/article';
import { sanityClient } from '@/utils/sanity.server';
import { sanityImage } from '@/utils/sanity.image';

const dateCompareFn = (a: { date: Date }, b: { date: Date }) => {
  return b.date.getTime() - a.date.getTime();
};

const ARTICLES_QUERY = `
*[_type == "article"] {
  ...,
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
        These are detailed, interactive deep-dives into topics I find
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

      <h2 className="text-content-xl sm:text-content-2xl font-semibold mb-4 mt-8">
        Blog
      </h2>

      <ul>
        {articles.map((post) => (
          <li key={post.slug} className="border-b">
            <Link
              href={`articles/${post.slug}`}
              className="flex flex-row p-2 gap-2 hover:bg-text/10 transition-colors"
            >
              {post.thumbnail ? (
                <img
                  className="w-20 h-20"
                  alt=""
                  src={sanityImage(post.thumbnail)
                    .width(80)
                    .height(80)
                    .dpr(2)
                    .url()}
                />
              ) : null}
              <div className="flex flex-col p-2 grow">
                <div className="flex flex-row items-baseline">
                  <span className="grow font-medium text-content-base/5">
                    {post.title}
                  </span>
                  <div className="flex flex-row items-baseline">
                    {post.tags.map((tag) => (
                      <div
                        key={tag}
                        className="px-2 border rounded-full text-content-xs/5"
                      >
                        {tag}
                      </div>
                    ))}
                  </div>
                </div>
                <span className="w-20 text-current/60 text-content-sm">
                  {post.date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  })}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
