import getPixelData from './getPixelData';

interface CopyImageDataOptions {
  mask?: CanvasRenderingContext2D;
  flip?: 'horizontal' | 'vertical' | 'both';
  skewX?: number;
  skewY?: number;
  dstAutoSize?: 'up' | 'always';
  bgColor?: number;
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

  // If there's no transforms or masking, we can copy source data directly
  // and avoid the overhead of pixel manipulation
  if (
    dw === sw &&
    dh === sh &&
    !options.mask &&
    !options.flip &&
    !options.skewX &&
    !options.skewY
  ) {
    dst.putImageData(srcImageData, dx, dy);
    return srcImageData;
  }

  // Auto-resize
  if (
    options.dstAutoSize === 'always' ||
    (options.dstAutoSize === 'up' && dw > dst.canvas.width)
  )
    dst.canvas.width = dw;

  if (
    options.dstAutoSize === 'always' ||
    (options.dstAutoSize === 'up' && dh > dst.canvas.height)
  )
    dst.canvas.height = dh;

  // Get dest data
  let dstImageData = dst.getImageData(dx, dy, dw, dh);
  let dstData = getPixelData(dstImageData);

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

  // If there's no skewing we can return the data as-is
  if (!options.skewX && !options.skewY) {
    dst.putImageData(dstImageData, dx, dy);
    return dstImageData;
  }

  // X-axis skew
  if (options.skewX) {
    const xOffsetPerPixel = Math.sin((Math.abs(options.skewX) * Math.PI) / 180);
    const newWidth =
      dstData.width + Math.round(dstData.height * xOffsetPerPixel);
    const invert = options.skewX > 0;

    // Resize dst canvas and get new target data
    dst.canvas.width = newWidth;
    const transformedImageData = dst.createImageData(newWidth, dstData.height);
    const transformedData = getPixelData(transformedImageData);

    for (let i = 0; i < transformedData.data.length; i++) {
      const x = i % transformedData.width;
      const y = ~~(i / transformedData.width);

      let oldX =
        x - Math.round((invert ? dstData.height - y - 1 : y) * xOffsetPerPixel);

      if (oldX < 0 || oldX >= dstData.width) {
        transformedData.data[i] = options.bgColor ?? 0;
      } else {
        const oldI = y * dstData.width + oldX;
        transformedData.data[i] = dstData.data[oldI];
      }
    }

    dstImageData = transformedImageData;
    dstData = transformedData;
  }

  // Y-axis skew
  if (options.skewY) {
    const yOffsetPerPixel = Math.sin((Math.abs(options.skewY) * Math.PI) / 180);
    const newHeight =
      dstData.width + Math.round(dstData.width * yOffsetPerPixel);
    const invert = options.skewY > 0;

    // Resize dst canvas and get new target data
    dst.canvas.height = newHeight;
    const transformedImageData = dst.createImageData(dstData.width, newHeight);
    const transformedData = getPixelData(transformedImageData);

    for (let i = 0; i < transformedData.data.length; i++) {
      const x = i % transformedData.width;
      const y = ~~(i / transformedData.width);

      let oldY =
        y - Math.round((invert ? dstData.width - x - 1 : x) * yOffsetPerPixel);

      if (oldY < 0 || oldY >= dstData.height) {
        transformedData.data[i] = options.bgColor ?? 0;
      } else {
        const oldI = oldY * dstData.width + x;
        transformedData.data[i] = dstData.data[oldI];
      }
    }

    dstImageData = transformedImageData;
    dstData = transformedData;
  }

  dst.putImageData(dstImageData, dx, dy);
  return dstImageData;
}
