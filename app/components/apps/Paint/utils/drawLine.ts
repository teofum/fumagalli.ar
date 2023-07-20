import type { PaintBrushFn } from '../types';
import setPixel from './setPixel';

export default function drawLine(
  ctx: CanvasRenderingContext2D,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  brushFn?: PaintBrushFn,
  dense: boolean = false,
) {
  const dx = x1 - x0;
  const dy = y1 - y0;

  // Line is a single point, draw one pixel
  if (x0 === x1 && y0 === y1) {
    if (brushFn) brushFn(ctx, x0, y0);
    setPixel(ctx, x0, y0);
    return;
  }

  if (Math.abs(dx) >= Math.abs(dy)) {
    // Horizontal slope, sort points by ascending X axis
    if (x0 > x1) {
      [x0, x1, y0, y1] = [x1, x0, y1, y0];
    }

    const deltaerr = dy / dx; // Change in Y per 1 pixel in X
    let y = y0;
    for (let x = Math.round(x0); x <= Math.round(x1); x++) {
      if (brushFn) brushFn(ctx, x, Math.round(y));
      setPixel(ctx, x, Math.round(y));

      y += deltaerr;

      // Dense line, if Y will be different next pixel draw at next Y too
      // Makes the line continuous in 4-adjacent as well as 8-adjacent
      if (dense && Math.round(y) !== Math.round(y - deltaerr)) {
        if (brushFn) brushFn(ctx, x, Math.round(y));
        setPixel(ctx, x, Math.round(y));
      }
    }
  } else {
    // Vertical slope, sort points by ascending Y axis
    if (y0 > y1) {
      [x0, x1, y0, y1] = [x1, x0, y1, y0];
    }

    const deltaerr = dx / dy; // Change in X per 1 pixel in Y
    let x = x0;
    for (let y = Math.round(y0); y <= Math.round(y1); y++) {
      if (brushFn) brushFn(ctx, Math.round(x), y);
      setPixel(ctx, Math.round(x), y);

      x += deltaerr;

      // Dense line, if X will be different next pixel draw at next X too
      // Makes the line continuous in 4-adjacent as well as 8-adjacent
      if (dense && Math.round(x) !== Math.round(x - deltaerr)) {
        if (brushFn) brushFn(ctx, Math.round(x), y);
        setPixel(ctx, Math.round(x), y);
      }
    }
  }
}
