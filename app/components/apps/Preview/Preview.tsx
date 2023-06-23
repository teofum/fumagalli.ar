import { useEffect } from 'react';
import { useDesktop } from '~/components/desktop/Desktop/context';
import { useWindow } from '~/components/desktop/Window/context';
import ScrollContainer from '~/components/ui/ScrollContainer';
import type { MarkdownFile } from '~/content/dir';

interface PreviewProps {
  file?: MarkdownFile;
}

export default function Preview({ file }: PreviewProps) {
  const { dispatch } = useDesktop();
  const { id } = useWindow();

  useEffect(() => {
    if (file)
      dispatch({
        type: 'setTitle',
        id,
        title: `${file.name} - Document Viewer`,
      });
  }, [dispatch, file, id]);

  if (!file) return null;

  return (
    <ScrollContainer>
      <div className="p-4 max-w-5xl">
        <file.component
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
          }}
        />
      </div>
    </ScrollContainer>
  );
}
