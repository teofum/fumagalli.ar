import { useRef } from 'react';

import { useWindow } from '~/components/desktop/Window/context';
import { files } from '~/components/apps/Files';
import Menu from '~/components/ui/Menu';

import { usePaintState } from '../context';

interface PaintFileMenuProps {
  clear: () => void;
}

export default function PaintFileMenu({ clear }: PaintFileMenuProps) {
  const { close, modal } = useWindow();

  const [state, setState] = usePaintState();
  const { canvas } = state;

  const newFile = () => {
    clear();
    setState({ filename: 'untitled', selection: null });
  };

  const openImage = (url: string, filename: string) => {
    const img = new Image();

    img.addEventListener(
      'load',
      () => {
        if (canvas) {
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          setState({
            canvasWidth: canvas.width,
            canvasHeight: canvas.height,
            filename,
          });

          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0);
        }
      },
      { once: true },
    );

    img.src = url;
  };

  const uploadImage = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const input = ev.target;
    if (input?.files) {
      const file = input.files[0];
      openImage(
        URL.createObjectURL(file),
        file.name.split('.').slice(0, -1).join('.'),
      );
    }
  };

  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const upload = () => hiddenInputRef.current?.click();

  const open = () => {
    modal(
      files({
        path: '/Documents',
        typeFilter: ['image'],
        modalCallback: (file, path) => {
          openImage(`/fs${path}`, file.name.split('.').slice(0, -1).join('.'));
        },
      }),
    );
  };

  const download = () => {
    if (!canvas) return;
    const dataUrl = canvas
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream');

    const filename = `${state.filename}.png`;

    const link = document.createElement('a');
    link.setAttribute('download', filename);
    link.setAttribute('href', dataUrl);
    link.click();
  };

  return (
    <>
      <Menu.Root trigger={<Menu.Trigger>File</Menu.Trigger>}>
        <Menu.Item label="New" onSelect={newFile} />
        <Menu.Item label="Upload..." onSelect={upload} />
        <Menu.Item label="Open..." onSelect={open} />
        <Menu.Item label="Save" onSelect={download} />

        <Menu.Separator />

        <Menu.Item label="Exit" onSelect={close} />
      </Menu.Root>

      <input
        type="file"
        className="hidden"
        ref={hiddenInputRef}
        onChange={uploadImage}
      />
    </>
  );
}
