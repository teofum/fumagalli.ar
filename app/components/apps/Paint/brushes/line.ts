import type { PaintBrush, PaintBrushFn } from '../types';
import clear from '../utils/clear';
import drawLine from '../utils/drawLine';

const functions: PaintBrushFn[] = [
  (ctx, x, y) => {
    ctx.fillRect(x, y, 1, 1);
  },
  (ctx, x, y) => {
    ctx.fillRect(x - 1, y - 1, 2, 2);
  },
  (ctx, x, y) => {
    ctx.fillRect(x, y - 1, 1, 3);
    ctx.fillRect(x - 1, y, 3, 1);
  },
  (ctx, x, y) => {
    ctx.fillRect(x - 1, y - 2, 2, 4);
    ctx.fillRect(x - 2, y - 1, 4, 2);
  },
  (ctx, x, y) => {
    ctx.fillRect(x - 2, y - 3, 3, 5);
    ctx.fillRect(x - 3, y - 2, 5, 3);
  },
];

export const line: PaintBrush = {
  name: 'line',
  onPointerDown: ({ x, y, fg, bg, pointerEvent, scratch, scratchCtx }) => {
    const color = pointerEvent.buttons === 2 ? bg : fg;

    clear(scratchCtx);

    // Set up line data
    scratch.color = color;
    scratch.startX = x;
    scratch.startY = y;
  },
  onPointerMove: ({ x, y, scratch, scratchCtx, brushVariant }) => {
    clear(scratchCtx);

    const brushFn = functions[brushVariant];

    scratchCtx.fillStyle = scratch.color;
    drawLine(scratchCtx, scratch.startX, scratch.startY, x, y, brushFn);
  },
  onPointerUp: ({ ctx, x, y, scratch, scratchCtx, brushVariant }) => {
    clear(scratchCtx);

    const brushFn = functions[brushVariant];

    ctx.fillStyle = scratch.color;
    drawLine(ctx, scratch.startX, scratch.startY, x, y, brushFn);

    // Clear scratch
    Object.keys(scratch).forEach((key) => delete scratch[key]);
  },
};
