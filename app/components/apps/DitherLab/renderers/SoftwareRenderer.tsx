import { useEffect } from 'react';

import { useAppState } from '~/components/desktop/Window/context';

import useSoftwareRenderer from '~/dither/renderers/useSoftwareRenderer';
import type softwareRenderProcess from '~/dither/software';
import Button from '~/components/ui/Button';

interface GlRendererProps {
  rt: HTMLCanvasElement | null;
  setRt: React.Dispatch<React.SetStateAction<HTMLCanvasElement | null>>;
  img: HTMLImageElement | null;
  setStatus: React.Dispatch<
    React.SetStateAction<'ready' | 'rendering' | 'done'>
  >;
  setRenderTime: React.Dispatch<React.SetStateAction<number>>;
}

export default function SoftwareRenderer({
  rt,
  setRt,
  img,
  setStatus,
  setRenderTime,
}: GlRendererProps) {
  const [state, setState] = useAppState('dither');

  const { render } = useSoftwareRenderer(
    rt,
    img,
    state.process as keyof typeof softwareRenderProcess,
    state.palette,
    state.settings,
  );

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
    <>
      <Button className="p-2" onClick={render}>Render</Button>
      <canvas
        ref={(el) => setRt(el)}
        className="border border-default"
        width={state.renderWidth}
        height={state.renderHeight}
        style={{ minWidth: `${state.renderWidth * state.zoom + 2}px` }}
      />
    </>
  );
}
