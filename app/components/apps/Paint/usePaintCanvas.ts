import { useEffect, useRef, useState } from 'react';

import type { PaintEvent } from './types';
import { useAppState } from '~/components/desktop/Window/context';
import { brushes } from './brushes';
import usePaint from './usePaint';

export default function usePaintCanvas() {
  const [state, setState] = useAppState('paint');
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

  const scratchRef = useRef<any>({});
  const scratchCanvasRef = useRef<HTMLCanvasElement>(null);

  const brush = brushes[state.brush];

  const [fr, fg, fb] = state.fgColor;
  const [br, bg, bb] = state.bgColor;
  const fgColor = `rgb(${fr} ${fg} ${fb})`;
  const bgColor = `rgb(${br} ${bg} ${bb})`;

  const lastPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const ref = (el: HTMLCanvasElement | null) => {
    setCanvas(el);
  };
  useEffect(() => {
    const ctx = canvas?.getContext('2d');
    const scratchCtx = scratchCanvasRef.current?.getContext('2d');

    if (canvas && ctx && scratchCanvasRef.current && scratchCtx) {
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);

      canvas.width = state.canvasWidth;
      canvas.height = state.canvasHeight;

      scratchCanvasRef.current.width = state.canvasWidth;
      scratchCanvasRef.current.height = state.canvasHeight;

      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = false;

      // Restore image data if not empty
      if (data.data[3] !== 0) {
        ctx.putImageData(data, 0, 0);
      }
    }
  }, [canvas, state.canvasWidth, state.canvasHeight]);

  const clear = () => {
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  function getPaintEvent(ev: PointerEvent) {
    const ctx = canvas?.getContext('2d');
    const scratchCtx = scratchCanvasRef.current?.getContext('2d');

    if (canvas && ctx && scratchCanvasRef.current && scratchCtx) {
      const canvasRect = canvas.getBoundingClientRect();
      const x = Math.round((ev.clientX - canvasRect.x) / state.zoom);
      const y = Math.round((ev.clientY - canvasRect.y) / state.zoom);

      const fromX = lastPos.current.x;
      const fromY = lastPos.current.y;

      lastPos.current = { x, y };

      const event: PaintEvent = {
        pointerEvent: ev,
        canvas,
        ctx,

        x,
        y,
        fromX,
        fromY,

        fg: fgColor,
        bg: bgColor,
        brushVariant: state.brushVariant,

        state,
        setState,

        scratch: scratchRef.current,
        scratchCanvas: scratchCanvasRef.current,
        scratchCtx,
      };

      return event;
    }
  }

  const onPaintStart = (ev: PointerEvent) => {
    const event = getPaintEvent(ev);
    if (event) brush.onPointerDown?.(event);
  };

  const onPaintMove = (ev: PointerEvent) => {
    const event = getPaintEvent(ev);
    if (event) brush.onPointerMove?.(event);
  };

  const onPaintEnd = (ev: PointerEvent) => {
    const event = getPaintEvent(ev);
    if (event) brush.onPointerUp?.(event);
  };

  const onPointerDown = usePaint({
    onPaintStart,
    onPaintMove,
    onPaintEnd,
  });

  const onContextMenu = (ev: React.MouseEvent) => ev.preventDefault();

  return {
    canvasProps: { ref, onPointerDown, onContextMenu },
    scratchCanvasProps: { ref: scratchCanvasRef },
    clear,
  };
}
