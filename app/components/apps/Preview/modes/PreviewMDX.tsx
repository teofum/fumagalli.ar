import ScrollContainer from '~/components/ui/ScrollContainer';
import { useAppState } from '~/components/desktop/Window/context';
import type { PreviewModeProps } from '../types';
import mdx from '~/content/mdx';
import Menu from '~/components/ui/Menu';
import RetroLink from '~/components/ui/Link';

export default function PreviewMDX({ commonMenu }: PreviewModeProps) {
  const [state] = useAppState('preview');
  if (state.file?._type !== 'fileMDX') throw new Error('Wrong file type');

  const slug = state.file.content.slug;
  const Component = mdx.find((article) => article.slug === slug)?.Component;
  if (!Component) return null;

  return (
    <>
      <Menu.Bar>{commonMenu}</Menu.Bar>

      <ScrollContainer className="flex-1">
        <article className="p-4 article font-text text-content-sm pb-16">
          <Component
            components={{
              h1: (props) => <h1 className="heading1" {...props} />,
              h2: (props) => <h2 className="heading2" {...props} />,
              h3: (props) => <h3 className="heading3" {...props} />,
              p: (props) => <p className="paragraph" {...props} />,
              a: ({ children, href }: any) => (
                <RetroLink
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {children}
                </RetroLink>
              ),
              li: (props) => (
                <li
                  className="mt-2 list-outside list-['>__'] ml-4"
                  {...props}
                />
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
            }}
          />
        </article>
      </ScrollContainer>
    </>
  );
}
