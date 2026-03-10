import type { MDXComponents } from 'mdx/types';

import RetroLink from '@/components/ui/Link';

export const mdxComponents = {
  h1: (props) => (
    <h1 className="font-title text-content-4xl text-h1 mb-8" {...props} />
  ),
  h2: (props) => (
    <h2
      className="font-heading text-content-2xl font-semibold tracking-tight text-h2 mt-12 mb-6"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="font-heading text-content-lg font-semibold tracking-tight text-h3 mt-3"
      {...props}
    />
  ),
  p: (props) => <p className="text-content-sm/6 mt-2" {...props} />,
  a: ({ children, href }) => (
    <RetroLink href={href} target="_blank" rel="noreferrer noopener">
      {children}
    </RetroLink>
  ),
  ul: (props) => (
    <ul className="mt-2 text-content-sm/6 list-disc ml-6" {...props} />
  ),
  pre: (props) => (
    <pre
      className="mt-2 text-content-xs bg-codeblock rounded-md p-4 my-4 overflow-auto"
      {...props}
    />
  ),
  blockquote: (props) => (
    <blockquote className="text-content-sm/6 mt-2 blockquote" {...props} />
  ),
} satisfies MDXComponents;

export function useMDXComponents(): MDXComponents {
  return mdxComponents;
}
