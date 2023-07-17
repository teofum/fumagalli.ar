import type { PaintBrush, PaintShapeFn } from '../types';
import clear from '../utils/clear';
import drawEllipse from '../utils/drawEllipse';
import drawRect from '../utils/drawRect';
import drawRoundedRect from '../utils/drawRoundedRect';

function shape(name: string, drawFn: PaintShapeFn): PaintBrush {
  return {
    name,
    onPointerDown: ({
      x,
      y,
      fg,
      bg,
      pointerEvent,
      scratch,
      scratchCtx,
      brushVariant,
    }) => {
      const color = pointerEvent.buttons === 2 ? bg : fg;
      const secondary = pointerEvent.buttons === 2 ? fg : bg;

      clear(scratchCtx);

      // Set up line data
      scratch.fill = brushVariant === 1 ? secondary : color;
      scratch.stroke = color;
      scratch.x0 = x;
      scratch.y0 = y;
    },
    onPointerMove: ({
      x,
      y,
      scratch,
      scratchCtx,
      brushVariant,
      pointerEvent,
    }) => {
      clear(scratchCtx);

      let { x0, y0 } = scratch;
      let w = x - x0;
      let h = y - y0;

      if (pointerEvent.shiftKey) {
        w = Math.sign(w) * Math.min(Math.abs(w), Math.abs(h));
        h = Math.sign(h) * Math.min(Math.abs(w), Math.abs(h));
      }

      if (pointerEvent.altKey) {
        x0 -= w;
        y0 -= h;
        w = w * 2 + 1;
        h = h * 2 + 1;
      }

      if (brushVariant > 0) {
        scratchCtx.fillStyle = scratch.fill;
        drawFn(scratchCtx, x0, y0, w, h, 'fill');
      }

      if (brushVariant < 2) {
        scratchCtx.fillStyle = scratch.stroke;
        drawFn(scratchCtx, x0, y0, w, h, 'stroke');
      }
    },
    onPointerUp: ({
      ctx,
      x,
      y,
      scratch,
      scratchCtx,
      brushVariant,
      pointerEvent,
    }) => {
      clear(scratchCtx);

      let { x0, y0 } = scratch;
      let w = x - x0;
      let h = y - y0;

      if (pointerEvent.shiftKey) {
        w = Math.sign(w) * Math.min(Math.abs(w), Math.abs(h));
        h = Math.sign(h) * Math.min(Math.abs(w), Math.abs(h));
      }

      if (pointerEvent.altKey) {
        x0 -= w;
        y0 -= h;
        w = w * 2 + 1;
        h = h * 2 + 1;
      }

      if (brushVariant > 0) {
        ctx.fillStyle = scratch.fill;
        drawFn(ctx, x0, y0, w, h, 'fill');
      }

      if (brushVariant < 2) {
        ctx.fillStyle = scratch.stroke;
        drawFn(ctx, x0, y0, w, h, 'stroke');
      }

      // Clear scratch
      Object.keys(scratch).forEach((key) => delete scratch[key]);
    },
  };
}

export const rectangle = shape('rectangle', drawRect);
export const ellipse = shape('ellipse', drawEllipse);
export const roundedrect = shape('roundedrect', drawRoundedRect);
