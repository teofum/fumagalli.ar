import { baseComponents } from '~/components/ui/Markdown';
import Component from '~/content/mdx/dither/dither.mdx';

export default function Post() {
  return (
    <article className="article pb-16">
      <Component components={baseComponents as any} />
    </article>
  );
}
