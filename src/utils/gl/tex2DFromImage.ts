import { ImageAsset } from '@/stores/dither-lab.store';

type GLImageOptions = {
  internalFormat: number;
  format: number;
  type: number;
};

function isAsset(image: ImageAsset | HTMLImageElement): image is ImageAsset {
  return (image as ImageAsset).meta !== undefined;
}

export default async function tex2DFromImage(
  gl: WebGLRenderingContext,
  image: ImageAsset | HTMLImageElement,
  options: GLImageOptions = {
    internalFormat: gl.RGBA,
    format: gl.RGBA,
    type: gl.UNSIGNED_BYTE,
  },
  texUnitIndex: number = gl.TEXTURE0,
) {
  // Create a texture
  const texture = gl.createTexture();
  if (!texture) throw new Error('tex2DFromImage: failed to create texture');

  gl.activeTexture(texUnitIndex);
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // TODO options
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  const bmp = isAsset(image)
    ? await createImageBitmap(new Blob([image.data]))
    : image;

  // Upload the image into the texture.
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    options.internalFormat,
    options.format,
    options.type,
    bmp,
  );

  return texture;
}
