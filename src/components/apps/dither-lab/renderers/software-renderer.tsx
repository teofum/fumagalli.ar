import cn from 'classnames';
import { useEffect } from 'react';

import useSoftwareRenderer from '@/components/apps/dither-lab/renderers/use-software-renderer';
import { useAppState } from '@/components/desktop/Window/context';
import Button from '@/components/ui/Button';
import ScrollContainer from '@/components/ui/ScrollContainer';
import { Toolbar, ToolbarGroup } from '@/components/ui/Toolbar';

import DitherLabContextMenu from '../components/dither-lab-context-menu';
import useAutoresize from '../utils/use-autoresize';
import type { RendererProps } from './gl-renderer';

export default function SoftwareRenderer({
  rt,
  setRt,
  status,
  setStatus,
  setRenderTime,
  viewportRef,
  save,
  children,
}: RendererProps) {
  const [state] = useAppState('dither');

  const renderer = useSoftwareRenderer(rt);

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

  useAutoresize(rt);

  return (
    <div className="grow flex flex-col gap-0.5 min-w-0">
      <ToolbarGroup className="flex flex-row">
        {children}
        <Toolbar>
          <Button
            className="py-1 px-2 w-20"
            onClick={status === 'rendering' ? stop : render}
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
        <DitherLabContextMenu save={save}>
          <div className="scroll-center">
            <canvas
              ref={(el) => setRt(el)}
              className={cn('border border-default', { hidden: !state.image })}
              width={state.renderWidth}
              height={state.renderHeight}
              style={{ minWidth: `${state.renderWidth * state.zoom + 2}px` }}
            />
            {!state.image ? <div>No image loaded</div> : null}
          </div>
        </DitherLabContextMenu>
      </ScrollContainer>
    </div>
  );
}
