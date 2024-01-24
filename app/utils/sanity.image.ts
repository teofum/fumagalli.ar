import createImageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

const imageBuilder = createImageUrlBuilder({
  projectId: 'y9lopbef',
  dataset: 'production',
});

export const sanityImage = (source: SanityImageSource) => {
  return imageBuilder.image(source).auto('format');
};
