export default function clear(ctx: CanvasRenderingContext2D, color = 0) {
  const { width, height } = ctx.canvas;

  const imageData = ctx.getImageData(0, 0, width, height);
  const pixelData = {
    width: imageData.width,
    height: imageData.height,
    data: new Uint32Array(imageData.data.buffer),
  };

  pixelData.data.fill(color);
  ctx.putImageData(imageData, 0, 0);
}
