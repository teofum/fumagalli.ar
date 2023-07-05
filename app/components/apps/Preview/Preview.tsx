import { useEffect } from 'react';

import { useAppState, useWindow } from '~/components/desktop/Window/context';

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

  const [state] = useAppState('preview');

  // Set window title to file title
  useEffect(() => {
    if (state.file) setTitle(id, `${state.file.name} - Preview`);
  }, [setTitle, id, state.file]);

  if (!state.file || !state.filePath) return null;

  const Component = getPreviewMode(state.file.type);
  return <Component />;
}
