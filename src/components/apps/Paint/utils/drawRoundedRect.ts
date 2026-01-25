import drawEllipse from './drawEllipse';
import drawRect from './drawRect';

export default function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  mode: 'fill' | 'stroke',
) {
  if (w < 0) {
    w = -w;
    x = x - w;
  }
  if (h < 0) {
    h = -h;
    y = y - h;
  }

  const r = Math.min(8, Math.floor(w / 2), Math.floor(h / 2));
  const d = r * 2;

  if (r <= 0) {
    drawRect(ctx, x, y, w, h, mode);
    return;
  }

  // Corners
  drawEllipse(ctx, x, y, d, d, mode, 1);
  drawEllipse(ctx, x + w - d - 1, y, d, d, mode, 2);
  drawEllipse(ctx, x + w - d - 1, y + h - d - 1, d, d, mode, 4);
  drawEllipse(ctx, x, y + h - d - 1, d, d, mode, 8);

  // Center and sides
  if (mode === 'fill') {
    ctx.fillRect(x + r, y + r, w - d, h - d); // Center
    ctx.fillRect(x + r, y, w - d, r); // Top
    ctx.fillRect(x, y + r, r, h - d); // Left
    ctx.fillRect(x + r, y + h - r, w - d, r); // Bottom
    ctx.fillRect(x + w - r, y + r, r, h - d); // Right
  } else {
    ctx.fillRect(x + r, y, w - d, 1); // Top
    ctx.fillRect(x, y + r, 1, h - d); // Left
    ctx.fillRect(x + r, y + h - 1, w - d, 1); // Bottom
    ctx.fillRect(x + w - 1, y + r, 1, h - d); // Right
  }
}
