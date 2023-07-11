import { useEffect, useMemo, useState } from 'react';
import type { ReactMarkdownOptions } from 'react-markdown/lib/react-markdown';
import { useAppState } from '~/components/desktop/Window/context';
import Markdown from '~/components/ui/Markdown';
import ScrollContainer from '~/components/ui/ScrollContainer';

export const helpComponents = {
  h1: (props) => <h1 className="bold text-h1 mb-3" {...props} />,
  h2: (props) => <h2 className="bold text-h2 mt-3" {...props} />,
  h3: (props) => <h3 className="bold text-h3 mt-2" {...props} />,
  strong: (props) => <strong className="font-normal bold" {...props} />,
  li: (props) => (
    <li className="mt-0.5 list-outside list-['>__'] ml-4" {...props} />
  ),
} satisfies ReactMarkdownOptions['components'];

export default function HelpContent() {
  const [state, setState] = useAppState('help');
  const resourceUrl = '/fs/system/Applications/help/content' + state.path;

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

  const components = useMemo<ReactMarkdownOptions['components']>(
    () => ({
      ...helpComponents,
      a: ({ href, children, ...props }) =>
        href?.startsWith('?') ? (
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <a
            href=""
            onClick={(ev) => {
              ev.preventDefault();
              setState({ path: href.slice(1) });
            }}
          >
            {children}
          </a>
        ) : (
          <a href={href} {...props}>
            {children}
          </a>
        ),
    }),
    [setState],
  );

  return (
    <ScrollContainer className="flex-1">
      <article className="p-4 max-w-xl">
        <Markdown components={components}>{content}</Markdown>
      </article>
    </ScrollContainer>
  );
}
