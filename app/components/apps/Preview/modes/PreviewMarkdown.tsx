import ScrollContainer from '~/components/ui/ScrollContainer';
import { baseComponents } from '~/components/ui/Markdown';
import { useAppState } from '~/components/desktop/Window/context';
import type { PreviewModeProps } from '../types';
import Menu from '~/components/ui/Menu';
import md from '~/content/md';

export default function PreviewMarkdown({ commonMenu }: PreviewModeProps) {
  const [state] = useAppState('preview');
  if (state.file?.type !== 'md') throw new Error('Wrong file type');

  const name = state.file.name.split('.').slice(0, -1).join('.');
  const Component = md.find((article) => article.title === name)?.Component;
  if (!Component) return null;

  return (
    <>
      <Menu.Bar>{commonMenu}</Menu.Bar>

      <ScrollContainer className="flex-1">
        <article className="p-4 max-w-3xl mx-auto font-text text-content-sm pb-16">
          <Component components={baseComponents as any} />
        </article>
      </ScrollContainer>
    </>
  );
}
