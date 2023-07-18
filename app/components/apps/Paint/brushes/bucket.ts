import type { PaintBrush } from '../types';
import floodFill from '../utils/floodFill';

export const bucket: PaintBrush = {
  name: 'bucket',
  onPointerDown: ({ ctx, x, y, state, pointerEvent, updateHistory }) => {
    const [r, g, b] =
      pointerEvent.buttons === 2 ? state.bgColor : state.fgColor;
    const color = 255 * 16777216 + b * 65536 + g * 256 + r;

    floodFill(ctx, x, y, color);

    updateHistory();
  },
};
