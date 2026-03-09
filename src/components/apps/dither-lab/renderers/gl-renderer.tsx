import { useEffect } from 'react';
import cn from 'classnames';

import { useAppState } from '@/components/desktop/Window/context';
import useGlRenderer from '@/components/apps/dither-lab/renderers/use-gl-renderer';
import ScrollContainer from '@/components/ui/ScrollContainer';
import { ToolbarGroup } from '@/components/ui/Toolbar';

import DitherLabContextMenu from '../components/dither-lab-context-menu';
import useImage from '../utils/use-image';

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
  const [state, update] = useAppState('dither');
  const image = useImage();

  const { render } = useGlRenderer(rt);
  useEffect(() => {
    render();
  }, [render, state.renderWidth, state.renderHeight, rt]);

  useEffect(() => {
    console.log('resize');

    // Get the DOM element for the render target canvas
    if (!rt) return;

    const [iw, ih] = [image?.meta.width ?? 0, image?.meta.height ?? 0];
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
      update({ renderWidth, renderHeight });
    }
  }, [state.height, state.width, state.resizeMode, update, image, rt]);

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
