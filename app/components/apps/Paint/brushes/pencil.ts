import type { PaintBrush } from '../types';
import drawLine from '../utils/drawLine';
import setPixel from '../utils/setPixel';

export const pencil: PaintBrush = {
  name: 'pencil',
  onPointerDown: ({ ctx, x, y, fg }) => {
    ctx.fillStyle = fg;
    setPixel(ctx, x, y);
  },
  onPointerMove: ({ ctx, x, y, fromX, fromY, fg, pointerEvent }) => {
    if (!pointerEvent.buttons) return;

    drawLine(ctx, fromX, fromY, x, y, fg);
  },
};
