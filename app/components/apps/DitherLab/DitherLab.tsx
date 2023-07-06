import { useEffect, useRef } from 'react';

import ScrollContainer from '~/components/ui/ScrollContainer';
import Toolbar from '~/components/ui/Toolbar';

import DitherLabImageInfo from './panels/DitherLabImageInfo';
// import { useAppState } from '~/components/desktop/Window/context';
import useGlRenderer from '~/dither/renderers/useGlRenderer';
import shaders from '~/dither/shaders';
import Button from '~/components/ui/Button';

export default function DitherLab() {
  // const [state] = useAppState('dither');

  const rtRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const { render } = useGlRenderer(
    rtRef.current,
    imgRef.current,
    shaders.patternFrag,
    { clistSize: 64, threshold: 0 },
    { u_err_mult: 0.2, u_gamma: 2.2 },
  );

  useEffect(() => {
    // Get the DOM element for the render target canvas
    const rt = rtRef.current;
    if (!rt) return;

    const [iw, ih] = [
      imgRef.current?.naturalWidth ?? 0,
      imgRef.current?.naturalHeight ?? 0,
    ];
    let [wNew, hNew] = [0, 0];

    // switch (opt.resize.mode) {
    //   case DlabResizeMode.KeepOriginalSize:
        wNew = iw;
        hNew = ih;
      //   break;
      // case DlabResizeMode.ForceResize:
      //   wNew = opt.resize.x;
      //   hNew = opt.resize.y;
      //   break;
      // case DlabResizeMode.FitToSize: {
      //   const wRatio = Math.min((opt.resize.x || 0) / iw, 1);
      //   const hRatio = Math.min((opt.resize.y || 0) / ih, 1);
      //   const resizeFactor = Math.min(wRatio, hRatio);

      //   wNew = ~~(iw * resizeFactor);
      //   hNew = ~~(ih * resizeFactor);
      //   break;
      // }
    // }

    if (wNew !== rt.width || hNew !== rt.height) {
      rt.width = wNew;
      rt.height = hNew;
    }
    rt.style.width = `${(1 * rt.width)}px`;
  });

  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <div className="flex flex-row gap-1">Menu</div>

      <div className="grow flex flex-row gap-0.5 min-h-0">
        <div className="grow flex flex-col gap-0.5 min-w-0">
          <Toolbar>
            <Button className="py-1 px-2 w-20" onClick={render}>
              <span>Render</span>
            </Button>
          </Toolbar>
          <ScrollContainer className="grow min-w-0 min-h-0">
            <canvas ref={rtRef} className="border border-default" />
          </ScrollContainer>
        </div>

        <div className="flex flex-col bevel-content w-56 min-w-56 p-0.5">
          <DitherLabImageInfo ref={imgRef} />
        </div>
      </div>
    </div>
  );
}
