import type { PaintBrushFn } from '../types';
import drawLine from './drawLine';
import lerp from './lerp';

const STEP = 1 / 64;

export function drawQuadraticBezier(
  ctx: CanvasRenderingContext2D,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  brushFn?: PaintBrushFn,
) {
  // Draw curve segments
  for (let t = 0; t < 1; t += STEP) {
    const x01t = lerp(x0, x1, t);
    const y01t = lerp(y0, y1, t);
    const x12t = lerp(x1, x2, t);
    const y12t = lerp(y1, y2, t);
    const xt = lerp(x01t, x12t, t);
    const yt = lerp(y01t, y12t, t);

    const n = t + STEP;
    const x01n = lerp(x0, x1, n);
    const y01n = lerp(y0, y1, n);
    const x12n = lerp(x1, x2, n);
    const y12n = lerp(y1, y2, n);
    const xn = lerp(x01n, x12n, n);
    const yn = lerp(y01n, y12n, n);

    drawLine(ctx, xt, yt, xn, yn, brushFn);
  }
}

export function drawCubicBezier(
  ctx: CanvasRenderingContext2D,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
  brushFn?: PaintBrushFn,
) {
  // Draw curve segments
  for (let t = 0; t < 1; t += STEP) {
    const x01t = lerp(x0, x1, t);
    const y01t = lerp(y0, y1, t);
    const x12t = lerp(x1, x2, t);
    const y12t = lerp(y1, y2, t);
    const x23t = lerp(x2, x3, t);
    const y23t = lerp(y2, y3, t);
    const xt = lerp(lerp(x01t, x12t, t), lerp(x12t, x23t, t), t);
    const yt = lerp(lerp(y01t, y12t, t), lerp(y12t, y23t, t), t);

    const n = t + STEP;
    const x01n = lerp(x0, x1, n);
    const y01n = lerp(y0, y1, n);
    const x12n = lerp(x1, x2, n);
    const y12n = lerp(y1, y2, n);
    const x23n = lerp(x2, x3, n);
    const y23n = lerp(y2, y3, n);
    const xn = lerp(lerp(x01n, x12n, n), lerp(x12n, x23n, n), n);
    const yn = lerp(lerp(y01n, y12n, n), lerp(y12n, y23n, n), n);

    drawLine(ctx, xt, yt, xn, yn, brushFn);
  }
}
