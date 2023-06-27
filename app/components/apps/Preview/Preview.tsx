import { useEffect } from 'react';
import useDesktopStore from '~/stores/desktop';
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

export interface PreviewProps {
  file?: PreviewSupportedFile;
  filePath?: string;
}

export default function Preview({ file, filePath }: PreviewProps) {
  const { setWindowProps } = useDesktopStore();
  const { id } = useWindow();

  // Set window title to file title
  useEffect(() => {
    if (file) setWindowProps(id, { title: `${file.name} - Preview` });
  }, [setWindowProps, file, id]);

  if (!file || !filePath) return null;

  const resourceUrl = '/fs' + filePath;
  const Component = getPreviewMode(file.type);
  return (
    <PreviewAppProvider file={file} resourceUrl={resourceUrl}>
      <Component />
    </PreviewAppProvider>
  );
}
