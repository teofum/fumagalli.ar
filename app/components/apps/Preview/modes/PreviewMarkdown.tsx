import ScrollContainer from '~/components/ui/ScrollContainer';
import { usePreviewApp } from '../context';

export default function PreviewMarkdown() {
  const { file } = usePreviewApp();
  if (file.type !== 'md') throw new Error('Wrong file type');

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
