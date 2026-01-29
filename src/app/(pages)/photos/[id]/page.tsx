import cn from 'classnames';
import {
  Aperture,
  Calendar,
  Camera,
  CircleGauge,
  Cog,
  Contrast,
  Expand,
  Film,
  Maximize2,
  SquareFunction,
} from 'lucide-react';
import NextLink from 'next/link';

import Collapsible from '@/components/pages/Collapsible';
import Link from '@/components/pages/link';
import { PHOTO_QUERY } from '@/queries/queries';
import { photoSchema } from '@/schemas/photos';
import { sanityImage } from '@/utils/sanity.image';
import { sanityClient } from '@/utils/sanity.server';
import { ServerComponentProps } from '@/utils/types';

import { getLensDisplayName } from '../get-lens-name';

export default async function Photos({ params }: ServerComponentProps) {
  const { id } = await params;

  if (typeof id !== 'string') return null;

  const photo = photoSchema.parse(await sanityClient.fetch(PHOTO_QUERY(id)));
  const { exif, dimensions } = photo.metadata;

  const vertical = dimensions.aspectRatio <= 1;

  const camera =
    photo.tags.find((tag) => tag.startsWith('camera:'))?.split(':')[1] ??
    'Unknown';
  const lens =
    photo.tags.find((tag) => tag.startsWith('lens:'))?.split(':')[1] ??
    exif.lens;
  const film = photo.tags.find((tag) => tag.startsWith('film:'))?.split(':')[1];

  const formatShutterSpeed = (ss: number) => {
    if (ss > 1) return `${ss} seconds`;
    else if (ss === 1) return `1 second`;
    return `1/${1 / ss} second`;
  };

  function formatWithFallback<T>(
    fmt: (s: T) => string,
    str: T | undefined,
    fallback: string,
  ) {
    return str !== undefined ? fmt(str) : fallback;
  }

  return (
    <>
      <div
        className={cn('mx-auto', {
          'max-w-3xl': vertical,
          'max-w-5xl': !vertical,
        })}
      >
        <div
          className="relative w-full group overflow-hidden"
          style={{ aspectRatio: dimensions.aspectRatio }}
        >
          <img
            className="absolute inset-0 w-full h-full object-cover"
            alt=""
            src={photo.metadata.lqip ?? undefined}
          />

          <img
            className="relative w-full object-cover"
            alt=""
            src={sanityImage(photo._id)
              .width(vertical ? 768 : 1024)
              .dpr(2)
              .quality(100)
              .url()}
            loading="lazy"
          />

          <div className="absolute bottom-0 right-0 bg-black/20 backdrop-blur-lg text-white">
            <NextLink
              href={`https://cdn.sanity.io/${photo.path}`}
              className="flex flex-row gap-2 items-center px-4 py-2 hover:bg-current/10 transition-colors duration-200"
            >
              <Maximize2 size={16} /> Full size
            </NextLink>
          </div>
        </div>

        <Collapsible title="Details">
          <div className="grid grid-cols-[auto_1fr] items-center border-b p-4 gap-3 text-content-sm/5">
            <Expand size={20} />
            <span>
              {photo.metadata.dimensions.width}&times;
              {photo.metadata.dimensions.height}
            </span>

            {exif.dateTime ? (
              <>
                <Calendar size={20} />
                <span>{exif.dateTime.toLocaleDateString()}</span>
              </>
            ) : null}

            <Camera size={20} />
            <span>
              <Link href={`/photos?camera=${camera}`}>{camera}</Link> /{' '}
              <Link href={`/photos?lens=${lens}`}>
                {getLensDisplayName(lens)}
              </Link>
            </span>

            {film ? (
              <>
                <Film size={20} />
                <span>
                  <Link href={`/photos?film=${film}`}>{film}</Link>
                </span>
              </>
            ) : null}

            {exif.focalLength ? (
              <>
                <SquareFunction size={20} />
                <span>{exif.focalLength}mm</span>
              </>
            ) : null}

            {exif.aperture ? (
              <>
                <Aperture size={20} />
                <span>f/{exif.aperture}</span>
              </>
            ) : null}

            {exif.shutterSpeed ? (
              <>
                <CircleGauge size={20} />
                <span>{formatShutterSpeed(exif.shutterSpeed)}</span>
              </>
            ) : null}

            {exif.focalLength ? (
              <>
                <Contrast size={20} />
                <span>
                  {formatWithFallback((s) => `ISO ${s}`, exif.iso, 'N/A')}
                </span>
              </>
            ) : null}

            <Cog size={20} />
            <span className="capitalize">
              {photo.metadata.exif.mode.replace(/-/g, ' ')}
            </span>
          </div>
        </Collapsible>
      </div>
    </>
  );
}
