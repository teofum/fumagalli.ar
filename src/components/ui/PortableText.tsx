'use client';

import { PortableText, PortableTextComponents } from '@portabletext/react';
import { ComponentProps } from 'react';

import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import vscDarkPlus from 'react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus';

import { sanityImage } from '@/utils/sanity.image';

import RetroLink from './Link';

SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('tsx', tsx);

export const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value, isInline }) => {
      return (
        <img
          className="mt-2 rounded-md"
          src={sanityImage(value)
            .width(isInline ? 100 : 1280)
            .fit('max')
            .url()}
          alt={value.alt || ''}
          loading="lazy"
        />
      );
    },
    code: ({ value }) => {
      return (
        <SyntaxHighlighter
          language={value.language}
          style={vscDarkPlus}
          className="text-content-xs! rounded-md! my-4! overflow-auto"
          codeTagProps={{ className: 'font-mono!' }}
        >
          {value.code}
        </SyntaxHighlighter>
      );
    },
  },
  block: {
    normal: (props) => <p className="text-content-sm/6 mt-2" {...props} />,
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
    blockquote: (props) => (
      <blockquote className="text-content-sm/6 mt-2 blockquote" {...props} />
    ),
  },
  list: {
    bullet: ({ children }) =>
      children ? (
        <ul className="mt-2 text-content-sm/6 list-disc ml-6">{children}</ul>
      ) : null,
  },
  marks: {
    link: ({ children, value }) => (
      <RetroLink href={value.href} target="_blank" rel="noreferrer noopener">
        {children}
      </RetroLink>
    ),
    code: ({ children }) => (
      <code className="bg-codeblock px-1 rounded-sm text-gray-900 dark:text-gray-100 font-mono">
        {children}
      </code>
    ),
  },
  // pre: (props) => (
  //   <pre
  //     className="paragraph text-content-xs bg-codeblock rounded-md p-4 my-4 overflow-auto"
  //     {...props}
  //   />
  // ),
};

export function CustomPortableText(props: ComponentProps<typeof PortableText>) {
  return <PortableText components={portableTextComponents} {...props} />;
}
