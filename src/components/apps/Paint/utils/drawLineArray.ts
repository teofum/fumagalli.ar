import drawLine from './drawLine';

export default function drawLineArray(
  ctx: CanvasRenderingContext2D,
  points: { x: number; y: number }[],
) {
  if (points.length < 2) return;

  for (let i = 0; i < points.length - 1; i++) {
    const { x: x0, y: y0 } = points[i];
    const { x: x1, y: y1 } = points[i + 1];
    drawLine(ctx, x0, y0, x1, y1);
  }
}
