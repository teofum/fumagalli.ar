export default function clear(ctx: CanvasRenderingContext2D) {
  ctx.canvas.width = ctx.canvas.width - 1;
  ctx.canvas.width = ctx.canvas.width + 1;
}
