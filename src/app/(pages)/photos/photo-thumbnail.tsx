import Link from 'next/link';

import { Photo } from '@/schemas/photos';
import { sanityImage } from '@/utils/sanity.image';

export type PhotoThumbnailProps = {
  photo: Photo;
  width?: number;
  height?: number;
  quality?: number;
  hrefPrefix?: string;
};

export function PhotoThumbnail({
  photo,
  width = 480,
  height = 320,
  quality = 80,
  hrefPrefix = '',
}: PhotoThumbnailProps) {
  return (
    <Link
      key={photo._id}
      href={`${hrefPrefix}${photo._id}`}
      className="block relative overflow-hidden group"
    >
      <img
        className="absolute inset-0 w-full h-full object-cover [image-rendering:auto]"
        alt=""
        src={photo.metadata.lqip ?? undefined}
      />

      <img
        className="relative w-full aspect-3/2 group-hover:scale-[1.05] transition-transform duration-200 object-cover"
        alt=""
        src={sanityImage(photo._id)
          .width(width)
          .height(height)
          .dpr(2)
          .quality(quality)
          .url()}
        loading="lazy"
      />
    </Link>
  );
}
