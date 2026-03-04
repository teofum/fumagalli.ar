import { Photo } from '@/schemas/photos';

export default function getPhotoDetails(photo: Photo) {
  const exif = photo.metadata.exif;

  const camera =
    photo.tags.find((tag) => tag.startsWith('camera:'))?.split(':')[1] ??
    'Unknown';
  const lens =
    photo.tags.find((tag) => tag.startsWith('lens:'))?.split(':')[1] ??
    exif.lens;
  const film = photo.tags.find((tag) => tag.startsWith('film:'))?.split(':')[1];

  const formatShutterSpeed = (ss: number) => {
    if (ss > 1 || [0.3, 0.4, 0.6, 0.7, 0.8, 0.9].includes(ss))
      return `${ss} seconds`;
    else if (ss === 1) return `1 second`;
    return `1/${1 / ss} second`;
  };

  function formatWithFallback<T>(
    fmt: (s: T) => string,
    str: T | undefined,
    fallback: string,
  ) {
    return str !== undefined && str !== null ? fmt(str) : fallback;
  }

  return {
    camera,
    lens,
    film,
    focalLength: formatWithFallback((s) => `${s}mm`, exif.focalLength, 'N/A'),
    shutterSpeed: formatWithFallback(
      formatShutterSpeed,
      exif.shutterSpeed,
      'N/A',
    ),
    aperture: formatWithFallback((s) => `f/${s}`, exif.aperture, 'N/A'),
    iso: formatWithFallback((s) => `${s}`, exif.iso, 'N/A'),
    date: formatWithFallback(
      (s) => s.toLocaleDateString(),
      exif.dateTime,
      'N/A',
    ),
  };
}
