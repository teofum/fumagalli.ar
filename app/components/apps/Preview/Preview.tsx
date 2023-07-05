import { useEffect } from 'react';

import { useAppState, useWindow } from '~/components/desktop/Window/context';

import {
  previewSupportedFileTypes,
  type PreviewSupportedFile,
  isPreviewable,
} from './types';
import PreviewMarkdown from './modes/PreviewMarkdown';
import PreviewImage from './modes/PreviewImage';
import useDesktopStore from '~/stores/desktop';
import Menu from '~/components/ui/Menu';
import { files } from '../Files';

const getPreviewMode = (fileType: PreviewSupportedFile['type']) => {
  switch (fileType) {
    case 'md':
      return PreviewMarkdown;
    case 'image':
      return PreviewImage;
  }
};

export default function Preview() {
  const { id, close, modal } = useWindow();
  const { setTitle } = useDesktopStore();

  const [state, setState] = useAppState('preview');

  // Set window title to file title
  useEffect(() => {
    if (state.file) setTitle(id, `${state.file.name} - Preview`);
  }, [setTitle, id, state.file]);

  if (!state.file || !state.filePath) return null;
  const resourceUrl = '/fs' + state.filePath;

  const open = () => {
    modal(
      files({
        path: state.filePath?.split('/').slice(0, -1).join('/') ?? '/Documents',
        typeFilter: previewSupportedFileTypes,
        modalCallback: (file, filePath) => {
          if (isPreviewable(file)) setState({ file, filePath });
        },
      }),
    );
  };

  const download = () => {
    const a = document.createElement('a');
    a.href = resourceUrl;
    a.download = '';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const Component = getPreviewMode(state.file.type);
  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <Component
        commonMenu={
          <Menu.Root trigger={<Menu.Trigger>File</Menu.Trigger>}>
            <Menu.Item label="Open..." onSelect={() => open()} />
            <Menu.Item label="Download" onSelect={() => download()} />

            <Menu.Separator />

            <Menu.Item label="Close" onSelect={() => close()} />
          </Menu.Root>
        }
      />
    </div>
  );
}
