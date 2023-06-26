import ScrollContainer from '~/components/ui/ScrollContainer';
import { usePreviewApp } from '../context';
import { useEffect, useState } from 'react';
import Markdown from '~/components/ui/Markdown';

export default function PreviewMarkdown() {
  const { file, resourceUrl } = usePreviewApp();
  if (file.type !== 'md') throw new Error('Wrong file type');

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
    <ScrollContainer>
      <div className="p-4 max-w-3xl">
        <Markdown>
          {content}
        </Markdown>
      </div>
    </ScrollContainer>
  );
}
