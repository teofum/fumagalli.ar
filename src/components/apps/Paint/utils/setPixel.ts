export default function setPixel(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
): void {
  ctx.fillRect(x, y, 1, 1);
}
