export interface PixelData {
  width: number;
  height: number;
  data: Uint32Array;
}

/**
 * Returns a Uint32Array view of an ImageData struct so pixels can be manipulated
 * as a single value. This makes pixel operations about 4x faster.
 */
export default function getPixelData(imageData: ImageData) {
  return {
    width: imageData.width,
    height: imageData.height,
    data: new Uint32Array(imageData.data.buffer),
  };
}
