import { createImageUrlBuilder, SanityImageSource } from '@sanity/image-url';
import type { ImageFile } from '@/schemas/file';
import useSystemStore from '@/stores/system';
import { Photo } from '@/schemas/photos';
import { useMemo } from 'react';

const imageBuilder = createImageUrlBuilder({
  projectId: 'y9lopbef',
  dataset: 'production',
});

export function sanityImage(
  source: SanityImageSource,
  autoFormat: boolean = true,
) {
  if (autoFormat) return imageBuilder.image(source).auto('format');
  return imageBuilder.image(source);
}

export function getImageSize(file: ImageFile) {
  return (
    file.content.asset._ref
      .split('-')
      .at(-2)
      ?.split('x')
      .map((s) => parseInt(s, 10)) ?? [0, 0]
  );
}

export function useImageSize(file: ImageFile) {
  const {
    settings: { imageSize },
  } = useSystemStore();

  return useMemo(() => {
    const [originalWidth, originalHeight] = getImageSize(file);
    const scaling = Math.min(
      1 / Math.min(originalWidth / imageSize, originalHeight / imageSize),
      1,
    );

    return [originalWidth * scaling, originalHeight * scaling];
  }, [file, imageSize]);
}

export function useImageSize2(dims: Photo['metadata']['dimensions']) {
  const {
    settings: { imageSize },
  } = useSystemStore();

  const scaling = Math.min(
    1 / Math.min(dims.width / imageSize, dims.height / imageSize),
    1,
  );

  return [~~(dims.width * scaling), ~~(dims.height * scaling)];
}

export function useImageUrl(file: ImageFile) {
  const {
    settings: { imageSize: size, imageQuality: quality },
  } = useSystemStore();

  // Get the width and height from the asset URL
  const [width, height] = getImageSize(file);
  if (!width || !height) return;

  if (width < height)
    return sanityImage(file.content)
      .width(Math.min(width, size))
      .quality(quality)
      .url();
  else
    return sanityImage(file.content)
      .height(Math.min(height, size))
      .quality(quality)
      .url();
}
