import useDrag from '~/hooks/useDrag';
import type { PaintEvent } from './types';
import { useEffect, useRef, useState } from 'react';
import { useAppState } from '~/components/desktop/Window/context';
import { brushes } from './brushes';

export default function usePaintCanvas() {
  const [state] = useAppState('paint');
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
      canvas.width = width;
      canvas.height = height;

      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = false;
    }
  }, [canvas]);

  const brushDown = (ev: PointerEvent) => {
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      const canvasRect = canvas.getBoundingClientRect();
      const x = ev.clientX - canvasRect.x;
      const y = ev.clientY - canvasRect.y;

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
      };

      brush.onPointerDown(event);
    }
  };

  const brushMove = (ev: PointerEvent) => {
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      const canvasRect = canvas.getBoundingClientRect();
      const x = ev.clientX - canvasRect.x;
      const y = ev.clientY - canvasRect.y;

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
      };

      brush.onPointerMove(event);
    }
  };

  // Originally intended for dragging, but this hook
  // works just as well for painting!
  const onPointerDown = useDrag(
    {
      onDragStart: brushDown,
      onDragMove: brushMove,
    },
    { allowSecondaryButton: true },
  );

  const onContextMenu = (ev: React.MouseEvent) => ev.preventDefault();

  return { ref, onPointerDown, onContextMenu };
}
