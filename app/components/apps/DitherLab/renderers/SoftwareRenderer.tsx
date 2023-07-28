import { useEffect } from 'react';
import cn from 'classnames';

import { useAppState } from '~/components/desktop/Window/context';

import useSoftwareRenderer from '~/dither/renderers/useSoftwareRenderer';
import type softwareRenderProcess from '~/dither/software';
import Button from '~/components/ui/Button';
import type { RendererProps } from './GlRenderer';
import ScrollContainer from '~/components/ui/ScrollContainer';
import { Toolbar, ToolbarGroup } from '~/components/ui/Toolbar';

export default function SoftwareRenderer({
  rt,
  setRt,
  img,
  status,
  setStatus,
  setRenderTime,
  viewportRef,
  children,
}: RendererProps) {
  const [state, setState] = useAppState('dither');

  const renderer = useSoftwareRenderer(
    rt,
    img,
    state.process as keyof typeof softwareRenderProcess,
    state.palette,
    state.settings,
  );

  const render = async () => {
    const start = performance.now();
    setStatus('rendering');
    await renderer.render();
    const time = performance.now() - start;
    setStatus('done');
    setRenderTime(time);
  };

  const stop = () => {
    renderer.stop();
    setStatus('ready');
  };

  useEffect(() => {
    setStatus((s) => (s === 'done' ? 'ready' : s));
  }, [state, setStatus]);

  useEffect(() => {
    console.log('resize');

    // Get the DOM element for the render target canvas
    if (!rt) return;

    const [iw, ih] = [state.naturalWidth ?? 0, state.naturalHeight ?? 0];
    let [renderWidth, renderHeight] = [0, 0];

    switch (state.resizeMode) {
      case 'none':
        renderWidth = iw;
        renderHeight = ih;
        break;
      case 'stretch':
        renderWidth = state.width;
        renderHeight = state.height;
        break;
      case 'fit': {
        const wRatio = Math.min(state.width / iw, 1);
        const hRatio = Math.min(state.height / ih, 1);
        const resizeFactor = Math.min(wRatio, hRatio);

        renderWidth = ~~(iw * resizeFactor);
        renderHeight = ~~(ih * resizeFactor);
        break;
      }
    }

    if (renderWidth !== rt.width || renderHeight !== rt.height) {
      setState({ renderWidth, renderHeight });
    }
  }, [
    state.height,
    state.width,
    state.resizeMode,
    state.naturalWidth,
    state.naturalHeight,
    setState,
    rt,
  ]);

  return (
    <div className="grow flex flex-col gap-0.5 min-w-0">
      <ToolbarGroup className="flex flex-row">
        {children}
        <Toolbar>
          <Button
            className="py-1 px-2 w-20"
            onClick={status === 'rendering' ? stop : render}
            disabled={!img}
          >
            <div className="flex flex-row items-center justify-center gap-1">
              <span>{status === 'rendering' ? 'Stop' : 'Render'}</span>
              {status === 'rendering' ? null : (
                <img
                  src={`/fs/System Files/UI/light_${
                    status === 'ready' ? 'on' : 'off'
                  }.png`}
                  alt=""
                />
              )}
            </div>
          </Button>
        </Toolbar>
      </ToolbarGroup>

      <ScrollContainer className="grow min-w-0 min-h-0" ref={viewportRef}>
        <div className="scroll-center">
          <canvas
            ref={(el) => setRt(el)}
            className={cn('border border-default', { hidden: !img })}
            width={state.renderWidth}
            height={state.renderHeight}
            style={{ minWidth: `${state.renderWidth * state.zoom + 2}px` }}
          />
          {!img ? <div>No image loaded</div> : null}
        </div>
      </ScrollContainer>
    </div>
  );
}
