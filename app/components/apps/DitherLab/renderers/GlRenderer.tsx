import { useEffect, useRef } from 'react';

import { useAppState } from '~/components/desktop/Window/context';

import useGlRenderer from '~/dither/renderers/useGlRenderer';
import shaders from '~/dither/shaders';

const SETTINGS = { clistSize: 64, threshold: 0 };
const UNIFORMS = { u_err_mult: 0.2, u_gamma: 2.2 };

export default function GlRenderer() {
  const [state, setState] = useAppState('dither');

  const rtRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const { render } = useGlRenderer(
    rtRef.current,
    imgRef.current,
    shaders.patternFrag,
    SETTINGS,
    UNIFORMS,
  );
  useEffect(render, [render, state.renderWidth, state.renderHeight]);

  useEffect(() => {
    console.log('resize');

    // Get the DOM element for the render target canvas
    const rt = rtRef.current;
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
  ]);

  return (
    <>
      {state.image ? (
        <img
          className="hidden"
          src={state.image.url}
          alt={state.image.filename}
          ref={imgRef}
        />
      ) : null}
      <canvas
        ref={rtRef}
        className="border border-default"
        width={state.renderWidth}
        height={state.renderHeight}
      />
    </>
  );
}
