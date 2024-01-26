import createImageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import type { ImageFile } from '~/schemas/file';

const imageBuilder = createImageUrlBuilder({
  projectId: 'y9lopbef',
  dataset: 'production',
});

export const MAX_IMG_SIZE = 2000;

export function sanityImage(source: SanityImageSource) {
  return imageBuilder.image(source).auto('format');
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

export function getFetchedImageSize(file: ImageFile) {
  const [originalWidth, originalHeight] = getImageSize(file);

  const scaling = Math.min(
    1 / Math.max(originalWidth / 2000, originalHeight / 2000),
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
