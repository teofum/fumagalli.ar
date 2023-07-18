import { useEffect, useRef, useState } from 'react';

import { useWindow } from '~/components/desktop/Window/context';
import Menu from '~/components/ui/Menu';
import ScrollContainer from '~/components/ui/ScrollContainer';
import usePaintCanvas from './usePaintCanvas';
import PaintToolbox from './ui/PaintToolbox';
import { paint_imageSize } from './modals/ImageSize';
import { type PaintState, defaultPaintState } from './types';
import { PaintProvider } from './context';
import PaintColor from './ui/PaintColor';
import { files } from '../Files';
import useDesktopStore from '~/stores/desktop';

// const resources = '/fs/system/Applications/paint/resources';

export default function Paint() {
  const { id, close, modal } = useWindow();
  const { setTitle } = useDesktopStore();

  const [state, _setState] = useState<PaintState>(defaultPaintState);
  const setState = (value: Partial<PaintState>) =>
    _setState({ ...state, ...value });

  useEffect(() => {
    setTitle(id, `${state.filename} - Paint`);
  }, [id, setTitle, state.filename]);

  const {
    clear,
    canvas,
    containerProps,
    canvasProps,
    scratchCanvasProps,
    selectionContainerProps,
    selectionCanvasProps,
    resizeHandles,
  } = usePaintCanvas(state, setState);

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
    <PaintProvider state={state} setState={setState}>
      <input
        type="file"
        className="hidden"
        ref={hiddenInputRef}
        onChange={uploadImage}
      />

      <div className="flex flex-col gap-0.5 min-w-0 select-none">
        <div className="flex flex-row gap-1">
          <Menu.Root trigger={<Menu.Trigger>File</Menu.Trigger>}>
            <Menu.Item label="New" onSelect={newFile} />
            <Menu.Item label="Upload..." onSelect={upload} />
            <Menu.Item label="Open..." onSelect={open} />
            <Menu.Item label="Save" onSelect={download} />

            <Menu.Separator />

            <Menu.Item label="Exit" onSelect={close} />
          </Menu.Root>

          <Menu.Root trigger={<Menu.Trigger>View</Menu.Trigger>}>
            <Menu.RadioGroup
              value={state.zoom.toString()}
              onValueChange={(value) => setState({ zoom: Number(value) })}
            >
              <Menu.RadioItem label="100%" value="1" />
              <Menu.RadioItem label="200%" value="2" />
              <Menu.RadioItem label="400%" value="4" />
              <Menu.RadioItem label="600%" value="6" />
              <Menu.RadioItem label="800%" value="8" />
            </Menu.RadioGroup>
          </Menu.Root>

          <Menu.Root trigger={<Menu.Trigger>Image</Menu.Trigger>}>
            <Menu.Item
              label="Canvas size..."
              onSelect={() => modal(paint_imageSize)}
            />
          </Menu.Root>
        </div>

        <div className="flex-1 flex flex-row gap-0.5 min-h-0">
          <PaintToolbox />

          <ScrollContainer className="flex-1 !bg-[#808080]">
            <div
              className="m-1 relative touch-none overflow-hidden w-min"
              {...containerProps}
            >
              {/* Drawing canvas */}
              <canvas {...canvasProps} />

              {/* Selection canvas */}
              <div {...selectionContainerProps}>
                <canvas {...selectionCanvasProps} />

                <div className="absolute -inset-0.5 mix-blend-difference pointer-events-none border border-dashed border-white" />
                {resizeHandles}
              </div>

              {/* Scratch canvas */}
              <canvas {...scratchCanvasProps} />
            </div>
          </ScrollContainer>
        </div>

        <PaintColor />
      </div>
    </PaintProvider>
  );
}
