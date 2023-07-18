import clamp from '~/utils/clamp';
import type { PaintBrush } from '../types';
import clear from '../utils/clear';
import drawRect from '../utils/drawRect';

export const select: PaintBrush = {
  name: 'select',
  onPointerDown: ({
    x,
    y,
    fg,
    bg,
    pointerEvent,
    scratch,
    scratchCtx,
    scratchCanvas,
  }) => {
    const color = pointerEvent.buttons === 2 ? bg : fg;

    clear(scratchCtx);
    scratchCanvas.style.setProperty('mix-blend-mode', 'difference');

    // Set up line data
    scratch.color = color;
    scratch.x0 = x;
    scratch.y0 = y;
  },
  onPointerMove: ({ x, y, scratch, scratchCtx }) => {
    clear(scratchCtx);

    let { x0, y0 } = scratch;
    let w = x - x0;
    let h = y - y0;

    scratchCtx.fillStyle = 'white';
    drawRect(scratchCtx, x0, y0, w, h, 'stroke');
  },
  onPointerUp: ({
    x,
    y,
    canvas,
    scratch,
    scratchCtx,
    scratchCanvas,
    select,
    deselect,
  }) => {
    clear(scratchCtx);
    scratchCanvas.style.setProperty('mix-blend-mode', 'normal');

    x = clamp(x, 0, canvas.width);
    y = clamp(y, 0, canvas.height);

    let { x0, y0 } = scratch;
    let w = x - x0;
    let h = y - y0;

    if (w !== 0 && h !== 0) {
      if (w < 0) {
        w = -w;
        x0 = x0 - w;
      }
      if (h < 0) {
        h = -h;
        y0 = y0 - h;
      }

      select({ x: x0, y: y0, w, h });
    } else deselect();

    // Clear scratch
    Object.keys(scratch).forEach((key) => delete scratch[key]);
  },
};
