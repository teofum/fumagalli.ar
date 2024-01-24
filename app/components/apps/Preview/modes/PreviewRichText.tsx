import { PortableText } from '@portabletext/react';

import ScrollContainer from '~/components/ui/ScrollContainer';
import { useAppState } from '~/components/desktop/Window/context';
import type { PreviewModeProps, PreviewSupportedFile } from '../types';
import Menu from '~/components/ui/Menu';
import { portableTextComponents } from '~/components/ui/PortableText';
import type { RichTextFile } from '~/schemas/file';

function isRichText(file?: PreviewSupportedFile): file is RichTextFile {
  return file?._type === 'fileRichText';
}

export default function PreviewRichText({ commonMenu }: PreviewModeProps) {
  const [state] = useAppState('preview');
  if (!isRichText(state.file)) throw new Error('Wrong file type');

  return (
    <>
      <Menu.Bar>{commonMenu}</Menu.Bar>

      <ScrollContainer className="flex-1">
        <article className="p-4 max-w-3xl mx-auto font-text text-content-sm pb-16">
          <PortableText
            value={state.file.content} // TODO type this properly
            components={portableTextComponents}
          />
        </article>
      </ScrollContainer>
    </>
  );
}
