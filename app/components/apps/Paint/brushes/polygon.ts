import type { PaintBrush } from '../types';
import clear from '../utils/clear';
import drawLineArray from '../utils/drawLineArray';
import fillPolygon from '../utils/fillPolygon';

const CLOSE_DISTANCE = 4;
const CLOSE_DISTANCE_SQUARED = CLOSE_DISTANCE * CLOSE_DISTANCE;
const DBL_CLICK = 300;

export const polygon: PaintBrush = {
  name: 'Polygon',
  hint: 'Click and drag to add points. Double click to close the shape.',
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

    if (scratch.points) {
      scratch.points.push({ x, y });

      scratchCtx.fillStyle = scratch.stroke;
      drawLineArray(scratchCtx, scratch.points);
    } else {
      scratch.points = [
        { x, y },
        { x, y },
      ];
    }
  },
  onPointerMove: ({ x, y, scratch, scratchCtx }) => {
    clear(scratchCtx);

    if (scratch.points) {
      const lastPoint = scratch.points.at(-1) as { x: number; y: number };
      lastPoint.x = x;
      lastPoint.y = y;

      scratchCtx.fillStyle = scratch.stroke;
      drawLineArray(scratchCtx, scratch.points);
    }
  },
  onPointerUp: ({
    ctx,
    x,
    y,
    scratch,
    scratchCtx,
    brushVariant,
    updateHistory,
  }) => {
    const { x: x0, y: y0 } = scratch.points[0];

    const dx = x - x0;
    const dy = y - y0;
    const dSquared = dx * dx + dy * dy;

    const { x: lastX, y: lastY } = scratch.points.at(-1);

    // Detect double click
    const now = ~~performance.now();
    const timeSinceLastClick = now - scratch.lastClick;
    const isDoubleClick =
      !isNaN(timeSinceLastClick) &&
      timeSinceLastClick < DBL_CLICK &&
      x === lastX &&
      y === lastY;

    if (dSquared <= CLOSE_DISTANCE_SQUARED || isDoubleClick) {
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

      updateHistory();

      // Clear scratch
      Object.keys(scratch).forEach((key) => delete scratch[key]);
    } else if (!isDoubleClick) scratch.lastClick = now;
  },
};
