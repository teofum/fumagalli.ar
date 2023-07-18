import type { PaintBrush, PaintBrushFn } from '../types';
import drawLine from '../utils/drawLine';

const square = (size: number): PaintBrushFn => {
  const offset = Math.floor(size / 2);
  return (ctx, x, y) => {
    ctx.fillRect(x - offset, y - offset, size, size);
  };
};

const functions: PaintBrushFn[] = [square(4), square(6), square(8), square(10)];

export const eraser: PaintBrush = {
  name: 'eraser',
  onPointerDown: ({ ctx, x, y, bg, brushVariant }) => {
    const brushFn = functions[brushVariant];

    ctx.fillStyle = bg;
    brushFn(ctx, x, y);
  },
  onPointerMove: ({
    ctx,
    x,
    y,
    fromX,
    fromY,
    bg,
    brushVariant,
    pointerEvent,
  }) => {
    if (!pointerEvent.buttons) return;
    const brushFn = functions[brushVariant];
    const isFlatBrush = brushVariant > 5;

    ctx.fillStyle = bg;
    drawLine(ctx, fromX, fromY, x, y, brushFn, isFlatBrush);
  },
  onPointerUp: ({ updateHistory }) => {
    updateHistory();
  },
};
