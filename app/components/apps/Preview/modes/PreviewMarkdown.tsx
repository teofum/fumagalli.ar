import ScrollContainer from '~/components/ui/ScrollContainer';
import { usePreviewApp } from '../context';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import { useEffect, useState } from 'react';

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
        <ReactMarkdown
          components={{
            h1: (props) => (
              <h1 className="font-display text-2xl text-h1" {...props} />
            ),
            h2: (props) => (
              <h2
                className="font-heading text-xl text-h2 mt-4 border-b border-current"
                {...props}
              />
            ),
            h3: (props) => (
              <h3
                className="font-text text-xl text-h3 mt-3 border-b border-current"
                {...props}
              />
            ),
            p: (props) => <p className="text-default mt-2" {...props} />,
            strong: (props) => <span className="bold" {...props} />,
            em: (props) => <em className="not-italic text-accent" {...props} />,
            a: ({ children, ...props }) => (
              <a {...props} target="_blank">
                {children}
              </a>
            ),
            li: (props) => (
              <li
                className="mt-2 list-outside list-['>__'] marker:bold ml-4"
                {...props}
              />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </ScrollContainer>
  );
}
