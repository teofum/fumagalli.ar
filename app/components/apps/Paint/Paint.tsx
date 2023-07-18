import { useEffect, useState } from 'react';

import { useWindow } from '~/components/desktop/Window/context';
import Menu from '~/components/ui/Menu';
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

// const resources = '/fs/system/Applications/paint/resources';

export default function Paint() {
  const { id } = useWindow();
  const { setTitle } = useDesktopStore();

  const [state, _setState] = useState<PaintState>(defaultPaintState);
  const setState = (value: Partial<PaintState>) =>
    _setState({ ...state, ...value });

  useEffect(() => {
    setTitle(id, `${state.filename} - Paint`);
  }, [id, setTitle, state.filename]);

  const {
    clear,
    containerProps,
    canvasProps,
    scratchCanvasProps,
    selectionContainerProps,
    selectionCanvasProps,
    resizeHandles,
  } = usePaintCanvas(state, setState);

  return (
    <PaintProvider state={state} setState={setState}>
      <div className="flex flex-col gap-0.5 min-w-0 select-none">
        <div className="flex flex-row gap-1">
          <PaintFileMenu clear={clear} />
          <PaintEditMenu />

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

          <PaintImageMenu />
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
                <div className="absolute -inset-px mix-blend-difference border border-dashed border-white">
                  {resizeHandles}
                </div>

                <canvas {...selectionCanvasProps} />
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
