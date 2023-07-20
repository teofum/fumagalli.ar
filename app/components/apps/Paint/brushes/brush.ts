import type { PaintBrush, PaintBrushFn } from '../types';
import drawLine from '../utils/drawLine';

const square = (size: number): PaintBrushFn => {
  const offset = Math.floor(size / 2);
  return (ctx, x, y) => {
    ctx.fillRect(x - offset, y - offset, size, size);
  };
};

const flat = (flip: boolean, size: number): PaintBrushFn => {
  const min = Math.floor(size / 2);
  const max = Math.ceil(size / 2);

  if (!flip) {
    return (ctx, x, y) => drawLine(ctx, x - min, y + min, x + max, y - max);
  } else {
    return (ctx, x, y) => drawLine(ctx, x - min, y - min, x + max, y + max);
  }
};

const functions: PaintBrushFn[] = [
  (ctx, x, y) => {
    ctx.fillRect(x - 1, y - 3, 3, 7);
    ctx.fillRect(x - 3, y - 1, 7, 3);
    ctx.fillRect(x - 2, y - 2, 5, 5);
  },
  (ctx, x, y) => {
    ctx.fillRect(x - 1, y - 2, 2, 4);
    ctx.fillRect(x - 2, y - 1, 4, 2);
  },
  (ctx, x, y) => {
    ctx.fillRect(x, y, 1, 1);
  },
  square(8),
  square(5),
  square(2),
  flat(false, 8),
  flat(false, 5),
  flat(false, 2),
  flat(true, 8),
  flat(true, 5),
  flat(true, 2),
];

export const brush: PaintBrush = {
  name: 'Brush',
  hint: 'Draw using a brush with the selected shape and size.',
  onPointerDown: ({ ctx, x, y, fg, bg, brushVariant, pointerEvent }) => {
    const color = pointerEvent.buttons === 2 ? bg : fg;
    const brushFn = functions[brushVariant];

    ctx.fillStyle = color;
    brushFn(ctx, x, y);
  },
  onPointerMove: ({
    ctx,
    x,
    y,
    fromX,
    fromY,
    fg,
    bg,
    brushVariant,
    pointerEvent,
  }) => {
    if (!pointerEvent.buttons) return;
    const color = pointerEvent.buttons === 2 ? bg : fg;
    const brushFn = functions[brushVariant];
    const isFlatBrush = brushVariant > 5;

    ctx.fillStyle = color;
    drawLine(ctx, fromX, fromY, x, y, brushFn, isFlatBrush);
  },
  onPointerUp: ({ updateHistory }) => {
    updateHistory();
  },
};
