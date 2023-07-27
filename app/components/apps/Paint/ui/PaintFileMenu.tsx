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

    const history: ImageData[] = [];
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx)
      history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));

    setState({
      filename: 'untitled',
      selection: null,
      history,
      undoCount: 0,
    });
  };

  const openImage = (url: string, filename: string) => {
    const img = new Image();

    img.addEventListener(
      'load',
      () => {
        if (canvas) {
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;

          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0);

          const history: ImageData[] = [];
          if (canvas && ctx)
            history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));

          setState({
            canvasWidth: canvas.width,
            canvasHeight: canvas.height,
            filename,
            selection: null,
            history,
            undoCount: 0,
          });
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
      <Menu.Menu trigger={<Menu.Trigger>File</Menu.Trigger>}>
        <Menu.Item label="New" onSelect={newFile} />
        <Menu.Item label="Upload..." onSelect={upload} />
        <Menu.Item label="Open..." onSelect={open} />
        <Menu.Item label="Save" onSelect={download} />

        <Menu.Separator />

        <Menu.Item label="Exit" onSelect={close} />
      </Menu.Menu>

      <input
        type="file"
        className="hidden"
        ref={hiddenInputRef}
        onChange={uploadImage}
      />
    </>
  );
}
