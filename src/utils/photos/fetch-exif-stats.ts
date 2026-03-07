import { EXIF_QUERY } from '@/queries/queries';
import { sanityClient } from '@/utils/sanity.server';
import { exifMetadataSchema } from '@/schemas/photos';

function minmax(array: (number | null | undefined)[]) {
  const [min, max] = array.reduce(
    ([min, max], v) => [
      Math.min(min, v ?? Number.MAX_VALUE),
      Math.max(max, v ?? -Number.MAX_VALUE),
    ],
    [Number.MAX_VALUE, -Number.MIN_VALUE],
  );

  return { min, max };
}

export async function fetchExifStats() {
  const data = exifMetadataSchema
    .array()
    .parse(await sanityClient.fetch(EXIF_QUERY));

  const lenses = [
    ...new Set(
      data.map((exif) => exif.lens).filter((lens) => lens !== undefined),
    ),
  ];

  const focalLength = minmax(data.map((exif) => exif.focalLength));
  const aperture = minmax(data.map((exif) => exif.aperture));
  const shutterSpeed = minmax(data.map((exif) => exif.shutterSpeed));
  const iso = minmax(data.map((exif) => exif.iso));

  return { lenses, focalLength, aperture, shutterSpeed, iso };
}

export type ExifStats = Awaited<ReturnType<typeof fetchExifStats>>;
