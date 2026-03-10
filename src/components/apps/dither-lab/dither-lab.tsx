import cn from 'classnames';
import { useCallback, useMemo, useRef, useState } from 'react';

import { useAppState, useWindow } from '@/components/desktop/Window/context';
import Button from '@/components/ui/Button';
import Menu from '@/components/ui/Menu';
import ScrollContainer from '@/components/ui/ScrollContainer';
import { Toolbar } from '@/components/ui/Toolbar';
import ZoomControls from '@/components/ui/zoom-controls';
import { useAppSettings } from '@/hooks/use-app-settings';
import useZoom from '@/hooks/use-zoom';

import DitherLabImageInfo from './panels/dither-lab-image-info';
import DitherLabPaletteEditor from './panels/dither-lab-palette-editor';
import DitherLabPaletteSelect from './panels/dither-lab-palette-select';
import DitherLabRenderOptions from './panels/dither-lab-render-options';
import DitherLabResizeOptions from './panels/dither-lab-resize-options';
import GlRenderer from './renderers/gl-renderer';
import SoftwareRenderer from './renderers/software-renderer';
import { DitherLabDevice, DitherLabSettings } from './types';
import useImage from './utils/use-image';
import useImageUploader from './utils/use-image-uploader';
import usePalettes from './utils/use-palettes';
import { saveFile } from '@/utils/file';

const ZOOM_STOPS = [1, 1.5, 2, 3, 4, 6, 8, 16, 32, 64];

export default function DitherLab() {
  const { close } = useWindow();
  const [state, update] = useAppState('dither');
  const [settings, set] = useAppSettings('dither');
  const image = useImage();

  const viewportRef = useRef<HTMLDivElement>(null);
  const [rt, setRt] = useState<HTMLCanvasElement | null>(null);

  const [status, setStatus] = useState<'ready' | 'rendering' | 'done'>('ready');
  const [renderTime, setRenderTime] = useState(0);

  /*
   * Image loading
   */
  const { upload, open } = useImageUploader();

  /*
   * Palettes
   */
  const palettes = usePalettes(rt);

  /*
   * Output saving
   */
  const download = () => {
    if (!rt || !image) return;

    rt.toBlob((blob) => {
      if (!blob) return;

      let filename = image.meta.filename.split('.').slice(0, -1).join('.');
      filename = `${filename} - ${state.palette.name}.png`;

      saveFile({
        suggestedName: filename,
        types: [{ accept: { ['image/png']: ['.png'] } }],
        data: blob,
      });
    });
  };

  /*
   * View
   */
  const setZoom = useCallback((zoom: number) => update({ zoom }), [update]);
  const zoom = useZoom(
    state.zoom,
    setZoom,
    viewportRef,
    undefined,
    ZOOM_STOPS,
    rt,
  );

  /*
   * UI
   */
  const Renderer = useMemo(
    () => (state.device === DitherLabDevice.GL ? GlRenderer : SoftwareRenderer),
    [state.device],
  );

  return (
    <div className="flex flex-col gap-0.5 min-w-0 select-none">
      <Menu.Bar>
        <Menu.Menu trigger={<Menu.Trigger>File</Menu.Trigger>}>
          <Menu.Item label="Upload..." onSelect={upload} />
          <Menu.Item label="Open..." onSelect={open} />
          <Menu.Item label="Save" onSelect={download} />

          <Menu.Separator />

          <Menu.Item label="Exit" onSelect={close} />
        </Menu.Menu>

        <Menu.Menu trigger={<Menu.Trigger>View</Menu.Trigger>}>
          <Menu.Sub label="Zoom">
            <Menu.RadioGroup
              value={state.zoom.toString()}
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

            <Menu.Item
              label="Zoom to fit"
              onSelect={() => zoom.zoomTo('fit')}
            />
            <Menu.Item
              label="Zoom to fill"
              onSelect={() => zoom.zoomTo('fill')}
            />
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
              onValueChange={(value) =>
                set({ panelSide: value as DitherLabSettings['panelSide'] })
              }
            >
              <Menu.RadioItem label="Left" value="left" />
              <Menu.RadioItem label="Right" value="right" />
            </Menu.RadioGroup>
          </Menu.Sub>
        </Menu.Menu>

        <Menu.Menu trigger={<Menu.Trigger>Palettes</Menu.Trigger>}>
          <Menu.Item label="Import..." onSelect={palettes.upload} />

          <Menu.Separator />

          <Menu.Item label="Clear custom palettes" onSelect={palettes.clear} />
        </Menu.Menu>
      </Menu.Bar>

      <div
        className={cn('grow flex gap-0.5 min-h-0', {
          'flex-row': settings.panelSide === 'right',
          'flex-row-reverse': settings.panelSide === 'left',
        })}
      >
        <Renderer
          rt={rt}
          setRt={setRt}
          status={status}
          setStatus={setStatus}
          setRenderTime={setRenderTime}
          viewportRef={viewportRef}
          save={download}
        >
          <Toolbar className="grow">
            <Button variant="light" className="p-1" onClick={download}>
              <img src="fs/System Files/UI/save2.png" alt="Save" />
            </Button>
          </Toolbar>
          <Toolbar>
            <ZoomControls {...zoom} stops={ZOOM_STOPS} />
          </Toolbar>
        </Renderer>

        <div className="flex flex-row gap-0.5">
          <ScrollContainer hide="x" className="bg-surface w-58 min-w-58">
            <div className="flex flex-col w-54 min-w-54">
              <DitherLabImageInfo upload={upload} open={open} />
              <DitherLabResizeOptions />
              <DitherLabPaletteSelect
                openEditor={() => set({ showPaletteEditor: true })}
                importPalettes={palettes.upload}
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
          <div className="py-0.5 px-2 bevel-light-inset text-ellipsis whitespace-nowrap overflow-hidden flex-3">
            {status === 'done'
              ? `Done (${renderTime.toFixed(0)}ms)`
              : status === 'ready'
                ? 'Ready'
                : 'Rendering...'}
          </div>
          <div className="py-0.5 px-2 bevel-light-inset text-ellipsis whitespace-nowrap overflow-hidden flex-1">
            {image?.meta.filename ?? ''}
          </div>
          <div className="py-0.5 px-2 bevel-light-inset text-ellipsis whitespace-nowrap overflow-hidden flex-1">
            {state.renderWidth}x{state.renderHeight}
          </div>
          <div className="py-0.5 px-2 bevel-light-inset text-ellipsis whitespace-nowrap overflow-hidden flex-1">
            {state.palette.name}
          </div>
        </div>
      ) : null}
    </div>
  );
}
