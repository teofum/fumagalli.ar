import { json } from '@remix-run/node';
import { Link, useLoaderData, type V2_MetaFunction } from '@remix-run/react';

import { articleSchema } from '~/schemas/article';
import { sanityClient } from '~/utils/sanity.server';

import DitherCard from '~/content/mdx/dither/dither.card';
import Dither2Card from '~/content/mdx/dither2/dither2.card';

export const meta: V2_MetaFunction = () => {
  return [
    { title: 'Articles — Teo Fumagalli' },
    { name: 'description', content: 'I write stuff sometimes' },
  ];
};

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

export async function loader() {
  const data = await articleSchema
    .array()
    .promise()
    .parse(sanityClient.fetch(ARTICLES_QUERY));

  return json(
    data.map(({ fileDate, legacyDate, ...article }) => ({
      ...article,
      date: legacyDate ?? fileDate,
    })),
  );
}

export default function PostsIndexRoute() {
  const data = useLoaderData<typeof loader>();

  const articles = data.map((article) => ({
    ...article,
    date: new Date(article.date),
  }));
  articles.sort(dateCompareFn);

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-title text-content-4xl sm:text-content-6xl mb-8">
        Writing
      </h1>

      <h2 className="heading2">Interactive articles</h2>
      <p className="mb-4">
        These are detailed, interactive deep-dives into a topic I find
        interesting. They take a long time to write and code, so don't expect a
        lot of them.
      </p>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-2">
        <Link to="mdx/introduction-to-dithering">
          <DitherCard />
        </Link>
        <Link to="mdx/dithering-color">
          <Dither2Card />
        </Link>
      </div>

      <h2 className="heading2">Other articles</h2>

      <ul>
        {articles.map((post) => (
          <li key={post.slug} className="border-t last:border-b">
            <Link
              to={post.slug}
              className="flex flex-row p-4 gap-4 hover:bg-text hover:bg-opacity-10 transition-colors"
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
