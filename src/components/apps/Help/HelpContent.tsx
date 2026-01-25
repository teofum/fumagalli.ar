import { useEffect } from 'react';
import { PortableText, type PortableTextComponents } from '@portabletext/react';

import { useAppState } from '@/components/desktop/Window/context';
import RetroLink from '@/components/ui/Link';
import ScrollContainer from '@/components/ui/ScrollContainer';
import type { RichTextFile } from '@/schemas/file';
import useFetch from '@/hooks/use-fetch';

export const helpComponents: PortableTextComponents = {
  block: {
    h1: (props) => <h1 className="bold text-h1 mb-3" {...props} />,
    h2: (props) => <h2 className="bold text-h2 mt-3" {...props} />,
    h3: (props) => <h3 className="bold text-h3 mt-2" {...props} />,
  },
  marks: {
    strong: (props) => <strong className="font-normal bold" {...props} />,
    link: ({ children, value }) => (
      <RetroLink href={value.href} target="_blank" rel="noreferrer noopener">
        {children}
      </RetroLink>
    ),
  },
  list: {
    bullet: ({ children }) =>
      children ? (
        <ul className="mt-0.5 list-outside list-['>__'] ml-4">{children}</ul>
      ) : null,
  },
};

interface HelpContentProps {
  setId: (id: string) => void;
}

export default function HelpContent({ setId }: HelpContentProps) {
  const [state] = useAppState('help');

  const { load, data: file } = useFetch<RichTextFile>();
  useEffect(() => {
    load(`/api/file?id=${state.openId}`);
  }, [state.openId, load]);

  return (
    <ScrollContainer className="flex-1">
      <article className="p-4 max-w-xl">
        <PortableText components={helpComponents} value={file?.content} />
      </article>
    </ScrollContainer>
  );
}
