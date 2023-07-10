import ScrollContainer from '~/components/ui/ScrollContainer';
import { useEffect, useState } from 'react';
import Markdown from '~/components/ui/Markdown';
import { useAppState } from '~/components/desktop/Window/context';
import type { PreviewModeProps } from '../types';

export default function PreviewMarkdown({ commonMenu }: PreviewModeProps) {
  const [state] = useAppState('preview');
  const resourceUrl = '/fs' + state.filePath;
  if (state.file?.type !== 'md') throw new Error('Wrong file type');

  const [content, setContent] = useState('No content available');
  useEffect(() => {
    if (!resourceUrl) return;

    const fetchMarkdown = async () => {
      const res = await fetch(resourceUrl);
      if (res.ok) {
        setContent(await res.text());
      }
    };

    fetchMarkdown();
  }, [resourceUrl]);

  return (
    <>
      <div className="flex flex-row gap-1">{commonMenu}</div>

      <ScrollContainer className="flex-1">
        <article className="p-4 max-w-3xl mx-auto font-text text-content-sm">
          <Markdown>{content}</Markdown>
        </article>
      </ScrollContainer>
    </>
  );
}
