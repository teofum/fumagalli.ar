import { useEffect } from 'react';

import { useAppState } from '@/components/desktop/Window/context';

import useImage from './use-image';

export default function useAutoresize(rt: HTMLCanvasElement | null) {
  const [state, update] = useAppState('dither');
  const image = useImage();

  useEffect(() => {
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
}
