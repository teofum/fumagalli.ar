import { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import type { ReactMarkdownOptions } from 'react-markdown/lib/react-markdown';
import RetroLink from './Link';

export const baseComponents = {
  h1: (props) => <h1 className="heading1" {...props} />,
  h2: (props) => <h2 className="heading2" {...props} />,
  h3: (props) => <h3 className="heading3" {...props} />,
  p: (props) => <p className="paragraph" {...props} />,
  a: ({ children, ...props }) => (
    <RetroLink href={props.href} target="_blank" rel="noreferrer noopener">
      {children}
    </RetroLink>
  ),
  li: (props) => (
    <li className="mt-2 list-outside list-['>__'] ml-4" {...props} />
  ),
  pre: (props) => (
    <pre
      className="paragraph text-content-xs bg-codeblock rounded-md p-4 my-4 overflow-auto"
      {...props}
    />
  ),
  blockquote: (props) => (
    <blockquote className="paragraph blockquote" {...props} />
  ),
} satisfies ReactMarkdownOptions['components'];

export default function Markdown({
  children,
  components,
  ...props
}: React.ComponentProps<typeof ReactMarkdown>) {
  const componentsMemo = useMemo(
    () => ({
      ...baseComponents,
      ...components,
    }),
    [components],
  );

  return (
    <ReactMarkdown components={componentsMemo} {...props}>
      {children}
    </ReactMarkdown>
  );
}
