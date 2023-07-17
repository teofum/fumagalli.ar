import { useEffect, useRef, useState } from 'react';

import type { PaintEvent } from './types';
import { useAppState } from '~/components/desktop/Window/context';
import { brushes } from './brushes';
import usePaint from './usePaint';

export default function usePaintCanvas() {
  const [state, setState] = useAppState('paint');
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

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
    if (canvas && ctx) {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width / state.zoom;
      canvas.height = height / state.zoom;

      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = false;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvas]);

  const clear = () => {
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width / state.zoom;
      canvas.height = height / state.zoom;

      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = false;
    }
  };

  const onPaintStart = (ev: PointerEvent) => {
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
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
      };

      brush.onPointerDown(event);
    }
  };

  const onPaintMove = (ev: PointerEvent) => {
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
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
      };

      brush.onPointerMove(event);
    }
  };

  const onPointerDown = usePaint({
    onPaintStart,
    onPaintMove,
  });

  const onContextMenu = (ev: React.MouseEvent) => ev.preventDefault();

  return {
    canvasProps: { ref, onPointerDown, onContextMenu },
    clear,
  };
}
