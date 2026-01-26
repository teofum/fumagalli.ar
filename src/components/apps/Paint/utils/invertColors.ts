export default function invertColors(ctx: CanvasRenderingContext2D) {
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);

  for (let i = 0; i < imageData.data.length / 4; i++) {
    imageData.data[i * 4] = 255 - imageData.data[i * 4];
    imageData.data[i * 4 + 1] = 255 - imageData.data[i * 4 + 1];
    imageData.data[i * 4 + 2] = 255 - imageData.data[i * 4 + 2];
  }

  ctx.putImageData(imageData, 0, 0);
}
