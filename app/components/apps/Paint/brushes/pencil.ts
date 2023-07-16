import type { PaintBrush } from '../types';
import drawLine from '../utils/drawLine';
import setPixel from '../utils/setPixel';

export const pencil: PaintBrush = {
  name: 'pencil',
  onPointerDown: ({ ctx, x, y, fg }) => {
    ctx.fillStyle = fg;
    setPixel(ctx, x, y);
  },
  onPointerMove: ({ ctx, x, y, fromX, fromY, fg, bg, pointerEvent }) => {
    if (!pointerEvent.buttons) return;
    const color = pointerEvent.buttons === 2 ? bg : fg;

    drawLine(ctx, fromX, fromY, x, y, color);
  },
};
