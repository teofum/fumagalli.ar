import { useAppState } from '@/components/desktop/Window/context';
import Menu from '@/components/ui/Menu';
import ScrollContainer from '@/components/ui/ScrollContainer';
import mdx from '@/content/mdx';
import { mdxComponents } from '@/mdx-components';

import type { PreviewModeProps } from '../types';

export default function PreviewMDX({ commonMenu }: PreviewModeProps) {
  const [state] = useAppState('preview');
  if (state.file?._type !== 'fileMDX') throw new Error('Wrong file type');

  const slug = state.file.content.slug;
  const Component = mdx.find((article) => article.slug === slug)?.Component;
  if (!Component) return null;

  return (
    <>
      <Menu.Bar>{commonMenu}</Menu.Bar>

      <ScrollContainer className="flex-1">
        <article className="p-4 article font-text text-content-sm pb-16">
          <Component components={mdxComponents} />
        </article>
      </ScrollContainer>
    </>
  );
}
