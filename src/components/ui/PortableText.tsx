'use client';

import { ComponentProps } from 'react';
import { PortableText, PortableTextComponents } from '@portabletext/react';
import { sanityImage } from '@/utils/sanity.image';

import RetroLink from './Link';

export const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value, isInline }) => {
      return (
        <img
          className="mt-2"
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
        <pre className="paragraph text-content-xs bg-codeblock rounded-md p-4 my-4 overflow-auto">
          {value.code}
        </pre>
      );
    },
  },
  block: {
    normal: (props) => <p className="paragraph" {...props} />,
    h1: (props) => <h1 className="heading1" {...props} />,
    h2: (props) => <h2 className="heading2" {...props} />,
    h3: (props) => <h3 className="heading3" {...props} />,
    blockquote: (props) => (
      <blockquote className="paragraph blockquote" {...props} />
    ),
  },
  list: {
    bullet: ({ children }) =>
      children ? (
        <ul className="mt-2 list-outside list-['>__'] ml-4">{children}</ul>
      ) : null,
  },
  marks: {
    link: ({ children, value }) => (
      <RetroLink href={value.href} target="_blank" rel="noreferrer noopener">
        {children}
      </RetroLink>
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
