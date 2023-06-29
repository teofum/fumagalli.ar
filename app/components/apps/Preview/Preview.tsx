import { useEffect } from 'react';

import { useAppState, useWindow } from '~/components/desktop/Window/context';

import { PreviewAppProvider } from './context';
import type { PreviewSupportedFile } from './types';
import PreviewMarkdown from './modes/PreviewMarkdown';
import PreviewImage from './modes/PreviewImage';
import useDesktopStore from '~/stores/desktop';

const getPreviewMode = (fileType: PreviewSupportedFile['type']) => {
  switch (fileType) {
    case 'md':
      return PreviewMarkdown;
    case 'image':
      return PreviewImage;
  }
};

export default function Preview() {
  const { id } = useWindow();
  const { setTitle } = useDesktopStore();

  const [{ file, filePath }] = useAppState('preview');

  // Set window title to file title
  useEffect(() => {
    if (file) setTitle(id, `${file.name} - Preview`);
  }, [setTitle, id, file]);

  if (!file || !filePath) return null;

  const resourceUrl = '/fs' + filePath;
  const Component = getPreviewMode(file.type);
  return (
    <PreviewAppProvider file={file} resourceUrl={resourceUrl}>
      <Component />
    </PreviewAppProvider>
  );
}
