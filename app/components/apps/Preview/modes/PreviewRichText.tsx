import ScrollContainer from '~/components/ui/ScrollContainer';
import { useAppState } from '~/components/desktop/Window/context';
import type { PreviewModeProps } from '../types';
import Menu from '~/components/ui/Menu';
import { PortableText } from '@portabletext/react';
import { portableTextComponents } from '~/components/ui/PortableText';

export default function PreviewRichText({ commonMenu }: PreviewModeProps) {
  const [state] = useAppState('preview');
  if (state.file?._type !== 'fileRichText') throw new Error('Wrong file type');

  return (
    <>
      <Menu.Bar>{commonMenu}</Menu.Bar>

      <ScrollContainer className="flex-1">
        <article className="p-4 max-w-3xl mx-auto font-text text-content-sm pb-16">
          <PortableText
            value={state.file.content as any} // TODO type this properly
            components={portableTextComponents}
          />
        </article>
      </ScrollContainer>
    </>
  );
}
