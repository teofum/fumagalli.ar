import { useEffect } from 'react';
import { useDesktop } from '~/components/desktop/Desktop/context';
import { useWindow } from '~/components/desktop/Window/context';
import { PreviewAppProvider, type PreviewSupportedFile } from './context';
import PreviewMarkdown from './modes/PreviewMarkdown';
import PreviewImage from './modes/PreviewImage';

const getPreviewMode = (fileType: PreviewSupportedFile['type']) => {
  switch (fileType) {
    case 'md':
      return PreviewMarkdown;
    case 'image':
      return PreviewImage;
  }
};

interface PreviewProps {
  file?: PreviewSupportedFile;
}

export default function Preview({ file }: PreviewProps) {
  const { dispatch } = useDesktop();
  const { id } = useWindow();

  // Set window title to file title
  useEffect(() => {
    if (file)
      dispatch({
        type: 'setTitle',
        id,
        title: `${file.name} - Preview`,
      });
  }, [dispatch, file, id]);

  if (!file) return null;

  const Component = getPreviewMode(file.type);
  return (
    <PreviewAppProvider file={file}>
      <Component />
    </PreviewAppProvider>
  );
}
