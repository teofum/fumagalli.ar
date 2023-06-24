import ScrollContainer from '~/components/ui/ScrollContainer';
import { usePreviewApp } from '../context';

export default function PreviewImage() {
  const { file } = usePreviewApp();
  if (file.type !== 'image') throw new Error('Wrong file type');

  return (
    <ScrollContainer>
      <div className="p-4 max-w-5xl">
        <img src={file.src} alt={file.altText} />
      </div>
    </ScrollContainer>
  );
}
