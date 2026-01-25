export default function drawRect(
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

  if (mode === 'fill') ctx.fillRect(x, y, w, h);
  else {
    ctx.fillRect(x, y, w, 1); // Top
    ctx.fillRect(x, y, 1, h); // Left
    ctx.fillRect(x, y + h - 1, w, 1); // Bottom
    ctx.fillRect(x + w - 1, y, 1, h); // Right
  }
}
