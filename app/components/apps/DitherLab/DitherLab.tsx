import { useRef, useState } from 'react';

import { useAppState, useWindow } from '~/components/desktop/Window/context';
import ScrollContainer from '~/components/ui/ScrollContainer';

import DitherLabImageInfo from './panels/DitherLabImageInfo';
import DitherLabResizeOptions from './panels/DitherLabResizeOptions';
import GlRenderer from './renderers/GlRenderer';
import DitherLabRenderOptions from './panels/DitherLabRenderOptions';
import DitherLabPaletteSelect from './panels/DitherLabPaletteSelect';
import { files } from '../Files';
import Menu from '~/components/ui/Menu';
import Button from '~/components/ui/Button';
import { useAppSettings } from '~/stores/system';
import cn from 'classnames';
import DitherLabPaletteEditor from './panels/DitherLabPaletteEditor';
import { DitherLabDevice } from './types';
import SoftwareRenderer from './renderers/SoftwareRenderer';

export const ZOOM_STOPS = [1, 1.5, 2, 3, 4, 6, 8, 16, 32, 64];

interface ZoomControlsProps {
  zoom: number;
  setZoom: (zoom: number) => void;
  zoomOut: () => void;
  zoomIn: () => void;
  zoomTo: (mode: 'fit' | 'fill') => void;
}

function ZoomControls({
  zoom,
  setZoom,
  zoomOut,
  zoomIn,
  zoomTo,
}: ZoomControlsProps) {
  return (
    <>
      <span className="px-2">Zoom</span>
      <div className="bg-default bevel-content p-0.5 flex flex-row">
        <Button
          className="py-0.5 px-1.5"
          onClick={zoomOut}
          disabled={zoom <= (ZOOM_STOPS.at(0) ?? 0)}
        >
          <span>-</span>
        </Button>
        <div className="py-0.5 px-2 w-12">{(zoom * 100).toFixed(0)}%</div>
        <Button
          className="py-0.5 px-1.5"
          onClick={zoomIn}
          disabled={zoom >= (ZOOM_STOPS.at(-1) ?? 0)}
        >
          <span>+</span>
        </Button>
      </div>
      <Button variant="light" className="py-1 px-2" onClick={() => setZoom(1)}>
        Reset
      </Button>
      <Button
        variant="light"
        className="py-1 px-2"
        onClick={() => zoomTo('fit')}
      >
        Fit
      </Button>
      <Button
        variant="light"
        className="py-1 px-2"
        onClick={() => zoomTo('fill')}
      >
        Fill
      </Button>
    </>
  );
}

export default function DitherLab() {
  const { close, modal } = useWindow();
  const [state, setState] = useAppState('dither');
  const [settings, set] = useAppSettings('dither');

  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const [rt, setRt] = useState<HTMLCanvasElement | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);

  const [status, setStatus] = useState<'ready' | 'rendering' | 'done'>('ready');
  const [renderTime, setRenderTime] = useState(0);

  const uploadImage = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const input = ev.target;
    if (input?.files) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.addEventListener(
        'load',
        () => {
          setState({
            image: {
              filename: file.name,
              url: reader.result as string,
              size: file.size,
            },
          });
        },
        { once: true },
      );
      reader.readAsDataURL(file);
    }
  };

  const onLoad = (ev: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = ev.target as HTMLImageElement;
    setState({ naturalWidth, naturalHeight });
  };

  const upload = () => hiddenInputRef.current?.click();

  const open = () => {
    modal(
      files({
        path: '/Documents',
        typeFilter: ['image'],
        modalCallback: (file, path) =>
          setState({
            image: {
              filename: file.name,
              size: file.size,
              url: `/fs${path}`,
            },
          }),
      }),
    );
  };

  const download = () => {
    if (!rt || !state.image) return;
    const dataUrl = rt
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream');

    let filename = state.image.filename.split('.').slice(0, -1).join('.');
    filename = `${filename} - ${state.palette.name}.png`;

    const link = document.createElement('a');
    link.setAttribute('download', filename);
    link.setAttribute('href', dataUrl);
    link.click();
  };

  const zoom = state.zoom;
  const setZoom = (zoom: number) => {
    setState({ zoom });
  };

  const zoomOut = () => {
    const nextZoomStop = ZOOM_STOPS.filter((stop) => stop < zoom).at(-1);
    setZoom(nextZoomStop ?? 1);
  };

  const zoomIn = () => {
    const nextZoomStop = ZOOM_STOPS.filter((stop) => stop > zoom).at(0);
    setZoom(nextZoomStop ?? 1);
  };

  const zoomTo = (mode: 'fit' | 'fill') => {
    if (!viewportRef.current || !rt) return;

    const { width: rtWidth, height: rtHeight } = rt;
    const { width, height } = viewportRef.current.getBoundingClientRect();

    // Account for image border and scrollbar
    const zoomToFitWidth = (width - 18) / rtWidth;
    const zoomToFitHeight = (height - 18) / rtHeight;

    setZoom(
      mode === 'fit'
        ? Math.min(zoomToFitWidth, zoomToFitHeight)
        : Math.max(zoomToFitWidth, zoomToFitHeight),
    );
  };

  return (
    <div className="flex flex-col gap-0.5 min-w-0 select-none">
      <input
        type="file"
        className="hidden"
        ref={hiddenInputRef}
        onChange={uploadImage}
      />
      {state.image ? (
        <img
          src={state.image.url}
          alt=""
          className="hidden"
          ref={(el) => setImg(el)}
          onLoad={onLoad}
        />
      ) : null}

      <div className="flex flex-row gap-1">
        <Menu.Root trigger={<Menu.Trigger>File</Menu.Trigger>}>
          <Menu.Item label="Upload..." onSelect={upload} />
          <Menu.Item label="Open..." onSelect={open} />

          <Menu.Separator />

          <Menu.Item label="Save" onSelect={download} />

          <Menu.Separator />

          <Menu.Item label="Exit" onSelect={close} />
        </Menu.Root>

        <Menu.Root trigger={<Menu.Trigger>View</Menu.Trigger>}>
          <Menu.Sub label="Zoom">
            <Menu.RadioGroup
              value={zoom.toString()}
              onValueChange={(value) => setZoom(Number(value))}
            >
              <Menu.RadioItem value="1" label="100%" />
              <Menu.RadioItem value="2" label="200%" />
              <Menu.RadioItem value="3" label="300%" />
              <Menu.RadioItem value="4" label="400%" />
              <Menu.RadioItem value="6" label="600%" />
              <Menu.RadioItem value="8" label="800%" />
            </Menu.RadioGroup>

            <Menu.Separator />

            <Menu.Item label="Zoom to fit" onSelect={() => zoomTo('fit')} />
            <Menu.Item label="Zoom to fill" onSelect={() => zoomTo('fill')} />
          </Menu.Sub>

          <Menu.Separator />

          <Menu.CheckboxItem
            label="Status Bar"
            checked={settings.showStatusBar}
            onCheckedChange={(checked) => set({ showStatusBar: checked })}
          />
          <Menu.CheckboxItem
            label="Palette Editor"
            checked={settings.showPaletteEditor}
            onCheckedChange={(checked) => set({ showPaletteEditor: checked })}
          />
          <Menu.Sub label="Tool Panels">
            <Menu.RadioGroup
              value={settings.panelSide}
              onValueChange={(value) => set({ panelSide: value as any })}
            >
              <Menu.RadioItem label="Left" value="left" />
              <Menu.RadioItem label="Right" value="right" />
            </Menu.RadioGroup>
          </Menu.Sub>
        </Menu.Root>
      </div>

      <div
        className={cn('grow flex gap-0.5 min-h-0', {
          'flex-row': settings.panelSide === 'right',
          'flex-row-reverse': settings.panelSide === 'left',
        })}
      >
        <div className="grow flex flex-col gap-0.5 min-w-0">
          <div className="flex flex-row bevel-light-inset p-px select-none">
            <div className="grow flex flex-row items-center bevel-light p-px">
              <Button variant="light" className="p-1" onClick={download}>
                <img src="fs/system/Resources/UI/save2.png" alt="Save" />
              </Button>
            </div>
            <div className="flex flex-row items-center bevel-light p-px">
              <ZoomControls
                zoom={zoom}
                setZoom={setZoom}
                zoomOut={zoomOut}
                zoomIn={zoomIn}
                zoomTo={zoomTo}
              />
            </div>
          </div>

          <ScrollContainer className="grow min-w-0 min-h-0" ref={viewportRef}>
            <div className="scroll-center">
              {state.device === DitherLabDevice.GL ? (
                <GlRenderer
                  rt={rt}
                  img={img}
                  setRt={setRt}
                  setStatus={setStatus}
                  setRenderTime={setRenderTime}
                />
              ) : (
                <SoftwareRenderer
                  rt={rt}
                  img={img}
                  setRt={setRt}
                  setStatus={setStatus}
                  setRenderTime={setRenderTime}
                />
              )}
            </div>
          </ScrollContainer>
        </div>

        <div className="flex flex-row gap-0.5">
          <ScrollContainer
            hide="x"
            className="bg-surface w-[14.5rem] min-w-[14.5rem]"
          >
            <div className="flex flex-col w-[13.5rem] min-w-[13.5rem]">
              <DitherLabImageInfo upload={upload} open={open} />
              <DitherLabResizeOptions />
              <DitherLabPaletteSelect
                openEditor={() => set({ showPaletteEditor: true })}
              />
              <DitherLabRenderOptions />
            </div>
          </ScrollContainer>

          {settings.showPaletteEditor ? (
            <DitherLabPaletteEditor
              close={() => set({ showPaletteEditor: false })}
            />
          ) : null}
        </div>
      </div>

      {settings.showStatusBar ? (
        <div className="flex flex-row gap-0.5">
          <div className="py-0.5 px-2 bevel-light-inset flex-[3]">
            {status === 'done'
              ? `Done (${renderTime.toFixed(0)}ms)`
              : status === 'ready'
              ? 'Ready'
              : 'Rendering...'}
          </div>
          <div className="py-0.5 px-2 bevel-light-inset flex-1">
            {state.image?.filename}
          </div>
          <div className="py-0.5 px-2 bevel-light-inset flex-1">
            {state.renderWidth}x{state.renderHeight}
          </div>
          <div className="py-0.5 px-2 bevel-light-inset flex-1">
            {state.palette.name}
          </div>
        </div>
      ) : null}
    </div>
  );
}