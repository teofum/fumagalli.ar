import type { PaintBrush } from '../types';
import drawLine from '../utils/drawLine';
import setPixel from '../utils/setPixel';

export const pencil: PaintBrush = {
  name: 'Pencil',
  hint: 'Draw a free-form line one pixel wide.',
  onPointerDown: ({ ctx, x, y, fg, bg, pointerEvent }) => {
    const color = pointerEvent.buttons === 2 ? bg : fg;

    ctx.fillStyle = color;
    setPixel(ctx, x, y);
  },
  onPointerMove: ({ ctx, x, y, fromX, fromY, fg, bg, pointerEvent }) => {
    if (!pointerEvent.buttons) return;
    const color = pointerEvent.buttons === 2 ? bg : fg;

    ctx.fillStyle = color;
    drawLine(ctx, fromX, fromY, x, y);
  },
  onPointerUp: ({ updateHistory }) => {
    updateHistory();
  },
};
