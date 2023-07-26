import { json, type LoaderArgs } from '@remix-run/node';
import { type V2_MetaFunction, useParams } from '@remix-run/react';

import { baseComponents } from '~/components/ui/Markdown';
import mdx from '~/content/mdx';

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `${data?.title} — Teo Fumagalli` },
    { name: 'description', content: 'A thing I wrote' },
  ];
};

export async function loader({ params }: LoaderArgs) {
  const { slug } = params;

  const title =
    mdx.find((article) => article.slug === slug)?.filename ?? '404 Not Found';
  return json({ title });
}

export default function Post() {
  const { slug } = useParams();

  const Component = mdx.find((article) => article.slug === slug)?.Component;
  if (!Component) return null;

  return (
    <article className="article pb-16">
      <Component components={baseComponents as any} />
    </article>
  );
}
