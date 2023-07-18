import type { PaintBrush } from '../types';
import clear from '../utils/clear';
import drawLineArray from '../utils/drawLineArray';
import fillPolygon from '../utils/fillPolygon';

const MIN_DISTANCE = 4;
const MIN_DISTANCE_SQUARED = MIN_DISTANCE * MIN_DISTANCE;

export const freehand: PaintBrush = {
  name: 'freehand',
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

    // Set up polygon data
    scratch.fill = brushVariant === 1 ? secondary : color;
    scratch.stroke = color;

    scratch.points = [{ x, y }];
  },
  onPointerMove: ({ x, y, scratch, scratchCtx }) => {
    clear(scratchCtx);

    if (scratch.points) {
      const { x: lastX, y: lastY } = scratch.points.at(-1) as {
        x: number;
        y: number;
      };

      const dx = x - lastX;
      const dy = y - lastY;
      const dSquared = dx * dx + dy * dy;

      scratchCtx.fillStyle = scratch.stroke;
      drawLineArray(scratchCtx, [...scratch.points, { x, y }]);

      if (dSquared >= MIN_DISTANCE_SQUARED) {
        scratch.points.push({ x, y });
      }
    }
  },
  onPointerUp: ({ ctx, x, y, scratch, scratchCtx, brushVariant }) => {
    const { x: x0, y: y0 } = scratch.points[0];

    const dx = x - x0;
    const dy = y - y0;

    clear(scratchCtx);

    if (dx !== 0 || dy !== 0) scratch.points.push({ x: x0, y: y0 }); // Close polygon

    if (brushVariant > 0) {
      ctx.fillStyle = scratch.fill;
      fillPolygon(ctx, scratch.points.slice(0, -1));
    }
    if (brushVariant < 2) {
      ctx.fillStyle = scratch.stroke;
      drawLineArray(ctx, scratch.points);
    }

    // Clear scratch
    Object.keys(scratch).forEach((key) => delete scratch[key]);
  },
};
