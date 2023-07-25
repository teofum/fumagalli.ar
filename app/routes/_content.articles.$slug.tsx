import { useParams } from '@remix-run/react';

import { baseComponents } from '~/components/ui/Markdown';
import mdx from '~/content/mdx';

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
