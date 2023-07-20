import getPixelData from "./getPixelData";

export default function rotateInPlace(
  ctx: CanvasRenderingContext2D,
  mode: 'cw' | 'ccw',
) {
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  const pixelData = getPixelData(imageData);

  [ctx.canvas.width, ctx.canvas.height] = [ctx.canvas.height, ctx.canvas.width];

  const rotatedData = ctx.createImageData(ctx.canvas.width, ctx.canvas.height);
  const rotatedPixelData = getPixelData(rotatedData);

  const { width, height } = rotatedPixelData;
  for (let i = 0; i < rotatedPixelData.data.length; i++) {
    const x = i % width;
    const y = ~~(i / width);

    const oldX = mode === 'ccw' ? height - y : y;
    const oldY = mode === 'ccw' ? x : width - x;
    const oldI = oldY * pixelData.width + oldX;

    rotatedPixelData.data[i] = pixelData.data[oldI];
  }

  ctx.putImageData(rotatedData, 0, 0);
  return rotatedData;
}
