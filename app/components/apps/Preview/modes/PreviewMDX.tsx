import ScrollContainer from '~/components/ui/ScrollContainer';
import { useAppState } from '~/components/desktop/Window/context';
import type { PreviewModeProps } from '../types';
import mdx from '~/content/mdx';
import { baseComponents } from '~/components/ui/Markdown';

export default function PreviewMDX({ commonMenu }: PreviewModeProps) {
  const [state] = useAppState('preview');
  if (state.file?.type !== 'mdx') throw new Error('Wrong file type');

  const name = state.file.name.split('.').slice(0, -1).join('.');
  const Component = mdx[name as keyof typeof mdx];
  if (!Component) return null;

  return (
    <>
      <div className="flex flex-row gap-1">{commonMenu}</div>

      <ScrollContainer className="flex-1">
        <article className="p-4 max-w-3xl mx-auto font-text text-content-sm">
          <Component components={baseComponents as any} />
        </article>
      </ScrollContainer>
    </>
  );
}
