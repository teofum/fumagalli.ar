import { useEffect, useMemo } from 'react';

import { useAppState } from '~/components/desktop/Window/context';

import useGlRenderer, {
  type RenderSettings,
} from '~/dither/renderers/useGlRenderer';
import { gpuProcess } from '../process';

const clistSize: { [key: string]: number | undefined } = {
  high: 64,
  medium: 16,
  low: 4,
};

interface GlRendererProps {
  rt: HTMLCanvasElement | null;
  setRt: React.Dispatch<React.SetStateAction<HTMLCanvasElement | null>>;
  img: HTMLImageElement | null;
  setStatus: React.Dispatch<
    React.SetStateAction<'ready' | 'rendering' | 'done'>
  >;
  setRenderTime: React.Dispatch<React.SetStateAction<number>>;
}

export default function GlRenderer({
  rt,
  setRt,
  img,
  setStatus,
  setRenderTime,
}: GlRendererProps) {
  const [state, setState] = useAppState('dither');

  const settings = useMemo<RenderSettings>(
    () => ({
      clistSize: clistSize[state.settings.quality] ?? 64,
      threshold: (state.settings.threshold as any) ?? 'bayer8',
    }),
    [state.settings],
  );

  const process = useMemo(() => gpuProcess[state.process], [state.process]);

  const { render } = useGlRenderer(
    rt,
    img,
    process.shader,
    state.palette,
    settings,
    state.uniforms,
  );
  useEffect(render, [render, state.renderWidth, state.renderHeight, rt, img]);

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
    <canvas
      ref={(el) => setRt(el)}
      className="border border-default"
      width={state.renderWidth}
      height={state.renderHeight}
      style={{ minWidth: `${state.renderWidth * state.zoom + 2}px` }}
    />
  );
}