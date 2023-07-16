import type { PaintBrushFn } from '../types';
import setPixel from './setPixel';

function drawLine(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  brushFn?: PaintBrushFn,
  dense: boolean = false,
): void {
  const dx = x2 - x1;
  const dy = y2 - y1;

  // Line is a single point, draw one pixel
  if (x1 === x2 && y1 === y2) {
    if (brushFn) brushFn(ctx, x1, y1);
    setPixel(ctx, x1, y1);
    return;
  }

  if (Math.abs(dx) >= Math.abs(dy)) {
    // Horizontal slope, sort points by ascending X axis
    if (x1 > x2) {
      [x1, x2, y1, y2] = [x2, x1, y2, y1];
    }

    const deltaerr = dy / dx; // Change in Y per 1 pixel in X
    let y = y1;
    for (let x = Math.round(x1); x <= Math.round(x2); x++) {
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
    if (y1 > y2) {
      [x1, x2, y1, y2] = [x2, x1, y2, y1];
    }

    const deltaerr = dx / dy; // Change in X per 1 pixel in Y
    let x = x1;
    for (let y = Math.round(y1); y <= Math.round(y2); y++) {
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

export default drawLine;
