import { useEffect, useState } from 'react';

import { useAppSettings } from '~/stores/system';
import { useWindow } from '~/components/desktop/Window/context';
import ScrollContainer from '~/components/ui/ScrollContainer';
import usePaintCanvas from './usePaintCanvas';
import PaintToolbox from './ui/PaintToolbox';
import { type PaintState, defaultPaintState } from './types';
import { PaintProvider } from './context';
import PaintColor from './ui/PaintColor';
import useDesktopStore from '~/stores/desktop';
import PaintFileMenu from './ui/PaintFileMenu';
import PaintEditMenu from './ui/PaintEditMenu';
import PaintImageMenu from './ui/PaintImageMenu';
import PaintViewMenu from './ui/PaintViewMenu';
import ContextMenu from '~/components/ui/ContextMenu';
import PaintContextMenu from './ui/PaintContextMenu';

// const resources = '/fs/system/Applications/paint/resources';

function PaintGrid({ zoom }: { zoom: number }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={
        {
          backgroundColor: '#C0C0C0',
          backgroundImage: `linear-gradient(
              45deg,#808080 25%, transparent 25%
            ),
            linear-gradient(
              -45deg,#808080 25%, transparent 25%
            ),
            linear-gradient(
              45deg, transparent 75%,#808080 75%
            ),
            linear-gradient(
              -45deg, transparent 75%,#808080 75%
            )`,
          backgroundSize: '2px 2px',
          backgroundPosition: '0 0, 0 1px, 1px -1px, -1px 0',
          WebkitMaskImage:
            'linear-gradient(white 1px, transparent 1px), linear-gradient(to right, white 1px, transparent 1px)',
          WebkitMaskSize: `${zoom}px ${zoom}px`,
        } as any
      }
    />
  );
}

export default function Paint() {
  const { id } = useWindow();
  const { setTitle } = useDesktopStore();

  const [settings, set] = useAppSettings('paint');

  const [state, _setState] = useState<PaintState>(defaultPaintState);
  const setState = (value: Partial<PaintState>) =>
    _setState({ ...state, ...value });

  useEffect(() => {
    setTitle(id, `${state.filename} - Paint`);
  }, [id, setTitle, state.filename]);

  const {
    clear,
    select,
    deselect,
    pasteIntoSelection,
    invert,
    flip,
    rotate,
    stretchAndSkew,
    selectionCanvas,
    containerProps,
    canvasProps,
    scratchCanvasProps,
    selectionContainerProps,
    selectionCanvasProps,
    resizeHandles,
  } = usePaintCanvas(state, setState);

  return (
    <PaintProvider
      state={state}
      setState={setState}
      clear={clear}
      select={select}
      deselect={deselect}
      pasteIntoSelection={pasteIntoSelection}
      invert={invert}
      flip={flip}
      rotate={rotate}
      stretchAndSkew={stretchAndSkew}
      selectionCanvas={selectionCanvas}
      settings={settings}
      set={set}
    >
      <div className="flex flex-col gap-0.5 min-w-0 select-none">
        <div className="flex flex-row gap-1">
          <PaintFileMenu clear={clear} />
          <PaintEditMenu />
          <PaintViewMenu />
          <PaintImageMenu />
        </div>

        <div className="flex-1 flex flex-row gap-0.5 min-h-0">
          <PaintToolbox />

          <ContextMenu.Root content={<PaintContextMenu />}>
            <ScrollContainer className="flex-1 !bg-[#808080]">
              <div
                className="m-1 relative touch-none w-min"
                {...containerProps}
              >
                {/* Drawing canvas */}
                <canvas {...canvasProps} />

                {/* Selection canvas */}
                <div {...selectionContainerProps}>
                  <div className="absolute -inset-px border border-white" />
                  <div className="absolute -inset-px mix-blend-difference border border-dashed border-white" />

                  {resizeHandles}

                  <canvas {...selectionCanvasProps} />
                </div>

                {/* Scratch canvas */}
                <canvas {...scratchCanvasProps} />

                {settings.grid && state.zoom >= 4 ? (
                  <PaintGrid zoom={state.zoom} />
                ) : null}
              </div>
            </ScrollContainer>
          </ContextMenu.Root>
        </div>

        <PaintColor />

        {settings.statusBar ? (
          <div className="flex flex-row gap-0.5">
            <div className="py-0.5 px-1 bevel-light-inset flex-[4]">.</div>
            <div className="py-0.5 px-1 bevel-light-inset flex-1">.</div>
            <div className="py-0.5 px-1 bevel-light-inset flex-1">.</div>
          </div>
        ) : null}
      </div>
    </PaintProvider>
  );
}
