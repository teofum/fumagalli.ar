import setPixel from './setPixel';

export default function drawEllipse(
  ctx: CanvasRenderingContext2D,
  x0: number,
  y0: number,
  w: number,
  h: number,
  mode: 'fill' | 'stroke',
  quadrants = 15, // Internal, used for drawing rounded rectangles
) {
  if (w < 0) {
    w = -w;
    x0 = x0 - w;
  }
  if (h < 0) {
    h = -h;
    y0 = y0 - h;
  }

  const rx = w / 2;
  const ry = h / 2;

  const cx = x0 + rx;
  const cy = y0 + ry;

  const paint = (x: number, y: number) => {
    if (mode === 'fill') {
      if (quadrants & 4) ctx.fillRect(cx , cy + y, Math.ceil(x), 1);     // Bottom right
      if (quadrants & 8) ctx.fillRect(cx - x, cy + y, Math.ceil(x), 1);  // Bottom left
      if (quadrants & 2) ctx.fillRect(cx , cy - y, Math.ceil(x), 1);     // Top right
      if (quadrants & 1) ctx.fillRect(cx - x, cy - y, Math.ceil(x), 1);  // Top left
    } else {
      if (quadrants & 4) setPixel(ctx, cx + x, cy + y); // Bottom right
      if (quadrants & 8) setPixel(ctx, cx - x, cy + y); // Bottom left
      if (quadrants & 2) setPixel(ctx, cx + x, cy - y); // Top right
      if (quadrants & 1) setPixel(ctx, cx - x, cy - y); // Top left
    }
  };

  // Region 1
  let x = -(rx % 1);
  let y = ry;
  let d = ry * ry - rx * rx * ry + 0.25 * rx * rx;
  let dx = 2 * ry * ry * x;
  let dy = 2 * rx * rx * y;

  while (dx < dy) {
    paint(x, y);

    if (d < 0) {
      x++;
      dx += 2 * ry * ry;
      d += dx + ry * ry;
    } else {
      x++;
      y--;
      dx += 2 * ry * ry;
      dy -= 2 * rx * rx;
      d += dx + ry * ry - dy;
    }
  }

  // Region 2
  d =
    ry * ry * (x + 0.5) * (x + 0.5) +
    rx * rx * (y - 1) * (y - 1) -
    rx * rx * ry * ry;

  while (y >= 0) {
    paint(x, y);

    if (d > 0) {
      y--;
      dy -= 2 * rx * rx;
      d += rx * rx - dy;
    } else {
      x++;
      y--;
      dy -= 2 * rx * rx;
      dx += 2 * ry * ry;
      d += dx + rx * rx - dy;
    }
  }
}
