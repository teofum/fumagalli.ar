import clamp from '~/utils/clamp';
import type { PaintBrush } from '../types';
import clear from '../utils/clear';
import drawRect from '../utils/drawRect';

export const select: PaintBrush = {
  name: 'select',
  onPointerDown: ({
    x,
    y,
    scratch,
    scratchCtx,
    scratchCanvas,
    pointerEvent,
  }) => {
    if (pointerEvent.buttons === 2) return;

    clear(scratchCtx);
    scratchCanvas.style.setProperty('mix-blend-mode', 'difference');

    scratch.x0 = x;
    scratch.y0 = y;
  },
  onPointerMove: ({ x, y, scratch, scratchCtx }) => {
    if (!scratch.x0) return;

    clear(scratchCtx);

    let { x0, y0 } = scratch;
    let w = x - x0;
    let h = y - y0;

    scratchCtx.fillStyle = 'white';
    drawRect(scratchCtx, x0, y0, w, h, 'stroke');
  },
  onPointerUp: ({
    canvas,
    ctx,
    x,
    y,
    bg,
    scratch,
    scratchCtx,
    scratchCanvas,
    select,
    deselect,
  }) => {
    if (!scratch.x0) return;

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

      // Fill selection rect in drawing canvas with bg color
      ctx.fillStyle = bg;
      ctx.fillRect(x0, y0, w, h);
    } else deselect();

    // Clear scratch
    Object.keys(scratch).forEach((key) => delete scratch[key]);
  },
};
