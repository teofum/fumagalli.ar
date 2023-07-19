import getPixelData from './getPixelData';

interface CopyImageDataOptions {
  mask?: CanvasRenderingContext2D;
  flip?: 'horizontal' | 'vertical' | 'both';
}

const defaultCopyImageDataOptions: CopyImageDataOptions = {};

export default function copyImageData(
  src: CanvasRenderingContext2D,
  sx: number,
  sy: number,
  sw: number,
  sh: number,
  dst: CanvasRenderingContext2D,
  dx: number,
  dy: number,
  dw = sw,
  dh = sh,
  options = defaultCopyImageDataOptions,
) {
  const srcImageData = src.getImageData(sx, sy, sw, sh);
  const srcData = getPixelData(srcImageData);

  if (dw === sw && dy === sy && !options.mask && !options.flip) {
    // If there's no scaling or masking, we can copy source data directly
    // and avoid the overhead of pixel manipulation
    dst.putImageData(srcImageData, dx, dy);
    return srcImageData;
  }

  const dstImageData = dst.getImageData(dx, dy, dw, dh);
  const dstData = getPixelData(dstImageData);

  const maskImageData = options.mask?.getImageData(sx, sy, sw, sh);

  // Copy image data using nearest-neighbor sampling
  for (let i = 0; i < dstData.data.length; i++) {
    const x = i % dstData.width;
    const y = ~~(i / dstData.width);

    let oldX = ~~((x * srcData.width) / dstData.width);
    let oldY = ~~((y * srcData.height) / dstData.height);

    if (options.flip === 'horizontal' || options.flip === 'both')
      oldX = srcData.width - oldX - 1;
    if (options.flip === 'vertical' || options.flip === 'both')
      oldY = srcData.height - oldY - 1;

    const oldI = oldY * srcData.width + oldX;

    if (maskImageData) {
      const maskAlpha = maskImageData.data[oldI * 4 + 3];

      // Copy src pixel only if mask has alpha > 0
      // We don't need proper alpha blending, at least not yet
      if (maskAlpha > 0) dstData.data[i] = srcData.data[oldI];
    } else dstData.data[i] = srcData.data[oldI];
  }

  dst.putImageData(dstImageData, dx, dy);
  return dstImageData;
}
