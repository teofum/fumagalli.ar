'use client';

import { markdownComponents } from '@/utils/markdownComponents';
import mdx from '@/content/mdx';

const posts = [...mdx];

export default function MDX({ slug }: { slug: string }) {
  const Component = posts.find((article) => article.slug === slug)?.Component;
  if (!Component) return null;

  return (
    <article className="article mdx pb-16">
      <Component components={markdownComponents} />
    </article>
  );
}
