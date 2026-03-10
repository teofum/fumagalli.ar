import cn from 'classnames';
import { useEffect } from 'react';

import useGlRenderer from '@/components/apps/dither-lab/renderers/use-gl-renderer';
import { useAppState } from '@/components/desktop/Window/context';
import ScrollContainer from '@/components/ui/ScrollContainer';
import { ToolbarGroup } from '@/components/ui/Toolbar';

import DitherLabContextMenu from '../components/dither-lab-context-menu';
import useAutoresize from '../utils/use-autoresize';

export type RendererProps = React.PropsWithChildren<{
  rt: HTMLCanvasElement | null;
  setRt: React.Dispatch<React.SetStateAction<HTMLCanvasElement | null>>;
  status: 'ready' | 'rendering' | 'done';
  setStatus: React.Dispatch<
    React.SetStateAction<'ready' | 'rendering' | 'done'>
  >;
  setRenderTime: React.Dispatch<React.SetStateAction<number>>;
  viewportRef: React.RefObject<HTMLDivElement | null>;
  save: () => void;
}>;

export default function GlRenderer({
  rt,
  setRt,
  viewportRef,
  save,
  children,
}: RendererProps) {
  const [state] = useAppState('dither');

  const { render } = useGlRenderer(rt);
  useEffect(() => {
    render();
  }, [render, state.renderWidth, state.renderHeight, rt]);

  useAutoresize(rt);

  return (
    <div className="grow flex flex-col gap-0.5 min-w-0">
      <ToolbarGroup className="flex flex-row">{children}</ToolbarGroup>

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
