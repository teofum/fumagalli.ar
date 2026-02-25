import Link from 'next/link';

import DitherCard from '@/content/mdx/dither/dither.card';
import Dither2Card from '@/content/mdx/dither2/dither2.card';

import fetchArticles from './fetch-articles';
import ArticleItem from '../article-item';

// Revalidate the page once every hour, this ensures content is reasonably fresh
export const revalidate = 3600;

export default async function PostsIndexRoute() {
  const articles = await fetchArticles();

  return (
    <div className="max-w-3xl mx-auto pb-16">
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

      <h2 className="text-content-xl sm:text-content-2xl font-semibold md:mb-4 mt-8">
        Blog
      </h2>

      <ul>
        {articles.map((post) => (
          <li key={post.slug} className="border-b">
            <ArticleItem post={post} />
          </li>
        ))}
      </ul>
    </div>
  );
}
