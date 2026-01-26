import { createImageUrlBuilder, SanityImageSource } from '@sanity/image-url';
import type { ImageFile } from '@/schemas/file';
import useSystemStore from '@/stores/system';

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
  const [originalWidth, originalHeight] = getImageSize(file);
  const {
    settings: { imageSize },
  } = useSystemStore();

  const scaling = Math.min(
    1 / Math.max(originalWidth / imageSize, originalHeight / imageSize),
    1,
  );

  return [originalWidth * scaling, originalHeight * scaling];
}

export function getImageUrl(file: ImageFile) {
  // Get the width and height from the asset URL
  const [width, height] = getImageSize(file);
  if (!width || !height) return;

  // TODO: allow adjusting this somewhere?
  if (width >= height)
    return sanityImage(file.content).width(2000).quality(80).url();
  else return sanityImage(file.content).height(2000).quality(80).url();
}

export function useImageUrl(file: ImageFile) {
  const {
    settings: { imageSize: size, imageQuality: quality },
  } = useSystemStore();

  // Get the width and height from the asset URL
  const [width, height] = getImageSize(file);
  if (!width || !height) return;

  // TODO: allow adjusting this somewhere?
  if (width >= height)
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
