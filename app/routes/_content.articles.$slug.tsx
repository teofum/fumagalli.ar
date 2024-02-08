import { json, type LoaderArgs } from '@remix-run/node';
import { type V2_MetaFunction, useParams } from '@remix-run/react';

import { markdownComponents } from '~/utils/markdownComponents';
import articles from '~/content/md/articles';
import mdx from '~/content/mdx';

const posts = [...mdx, ...articles];

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `${data?.title} — Teo Fumagalli` },
    { name: 'description', content: 'A thing I wrote' },
  ];
};

export async function loader({ params }: LoaderArgs) {
  const { slug } = params;

  const title =
    posts.find((article) => article.slug === slug)?.title ?? '404 Not Found';
  return json({ title });
}

export default function Post() {
  const { slug } = useParams();

  const Component = posts.find((article) => article.slug === slug)?.Component;
  if (!Component) return null;

  return (
    <article className="article pb-16">
      <Component components={markdownComponents} />
    </article>
  );
}
