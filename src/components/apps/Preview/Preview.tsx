import { useEffect, useRef } from 'react';

import { useAppState, useWindow } from '@/components/desktop/Window/context';
import Menu from '@/components/ui/Menu';
import useDesktopStore from '@/stores/desktop';
import useFetch from '@/hooks/use-fetch';

import { files } from '@/components/apps/Files';
import PreviewImage from './modes/PreviewImage';
import PreviewMDX from './modes/PreviewMDX';
import PreviewRichText from './modes/PreviewRichText';
import {
  previewSupportedFileTypes,
  type PreviewSupportedFile,
  isPreviewable,
} from './types';

export default function Preview() {
  const { id, close, modal } = useWindow();
  const { setTitle } = useDesktopStore();

  const [state, setState] = useAppState('preview');

  const { load, data, state: fetchState } = useFetch<PreviewSupportedFile>();

  /**
   * Initialization, load file contents and set window title
   */
  const openFileId = useRef('');
  useEffect(() => {
    if (!state.fileStub || state.fileStub._id === openFileId.current) return;
    setTitle(id, `${state.fileStub.name} - Preview`);
    load(`/api/file?id=${state.fileStub._id}`);
  }, [setTitle, setState, id, state.fileStub, load]);

  useEffect(() => {
    if (!data || data._id === openFileId.current) return;
    openFileId.current = data._id;

    setState({ file: data });
  }, [data, setState, state.file]);

  if (fetchState === 'loading')
    return (
      <div className="flex flex-col items-center justify-center gap-0.5 min-w-0">
        Starting...
      </div>
    );

  if (!state.file) return null;

  const open = () => {
    modal(
      files({
        typeFilter: previewSupportedFileTypes,
        modalCallback: (stub) => {
          if (isPreviewable(stub)) setState({ fileStub: stub });
        },
      }),
    );
  };

  let Component = PreviewMDX;
  switch (state.file._type) {
    case 'fileRichText':
      Component = PreviewRichText;
      break;
    case 'fileMDX':
      Component = PreviewMDX;
      break;
    case 'fileImage':
      Component = PreviewImage;
      break;
  }

  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <Component
        commonMenu={
          <Menu.Menu trigger={<Menu.Trigger>File</Menu.Trigger>}>
            <Menu.Item label="Open..." onSelect={open} />

            <Menu.Separator />

            <Menu.Item label="Close" onSelect={close} />
          </Menu.Menu>
        }
      />
    </div>
  );
}
