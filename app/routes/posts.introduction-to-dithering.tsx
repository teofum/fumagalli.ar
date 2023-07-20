import { baseComponents } from '~/components/ui/Markdown';
import Component from '~/content/mdx/dither/dither.mdx';

export default function Post() {
  return <Component components={baseComponents as any} />;
}
