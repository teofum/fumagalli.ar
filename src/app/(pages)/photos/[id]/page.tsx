import cn from 'classnames';

import { PHOTO_QUERY } from '@/queries/queries';
import { photoSchema } from '@/schemas/photos';
import { sanityImage } from '@/utils/sanity.image';
import { sanityClient } from '@/utils/sanity.server';
import { ServerComponentProps } from '@/utils/types';
import Collapsible from '@/components/pages/Collapsible';
import {
  Aperture,
  Calendar,
  Camera,
  CircleGauge,
  Cog,
  Contrast,
  Expand,
  Maximize2,
  SquareFunction,
} from 'lucide-react';
import Link from 'next/link';

export default async function Photos({ params }: ServerComponentProps) {
  const { id } = await params;

  if (typeof id !== 'string') return null;

  const photo = photoSchema.parse(await sanityClient.fetch(PHOTO_QUERY(id)));
  const { exif, dimensions } = photo.metadata;

  const vertical = dimensions.aspectRatio <= 1;

  const camera =
    photo.tags.find((tag) => tag.startsWith('camera:'))?.split(':')[1] ??
    'Unknown';

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
      {/*<div className="max-w-3xl mx-auto flex flex-row items-center mb-8">
        <h1 className="font-title text-content-4xl sm:text-content-6xl grow">
          {photo.originalFilename}
        </h1>
      </div>*/}

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

          <div className="absolute bottom-0 right-0 bg-black/20 backdrop-blur-lg px-4 py-2 text-white">
            <Link
              href={`https://cdn.sanity.io/${photo.path}`}
              className="flex flex-row gap-2 items-center"
            >
              <Maximize2 size={16} /> Full size
            </Link>
          </div>
        </div>

        <Collapsible title="Details">
          <div className="grid grid-cols-[auto_1fr] items-center border-b p-4 gap-3 text-content-sm/5">
            <Expand size={20} />
            <span>
              {photo.metadata.dimensions.width}&times;
              {photo.metadata.dimensions.height}
            </span>

            <Calendar size={20} />
            <span>{exif.dateTime.toLocaleDateString()}</span>

            <Camera size={20} />
            <span>
              {camera} / {exif.lens ?? 'Unknown lens'}
            </span>

            <SquareFunction size={20} />
            <span>
              {formatWithFallback((s) => `${s}mm`, exif.focalLength, 'N/A')}
            </span>

            <Aperture size={20} />
            <span>
              {formatWithFallback((s) => `f/${s}`, exif.aperture, 'N/A')}
            </span>

            <CircleGauge size={20} />
            <span>{formatShutterSpeed(exif.shutterSpeed)}</span>

            <Contrast size={20} />
            <span>ISO {photo.metadata.exif.iso}</span>

            <Cog size={20} />
            <span className="capitalize">
              {photo.metadata.exif.mode.replace(/-/g, ' ')}
            </span>
          </div>
        </Collapsible>
      </div>

      <div className="max-w-3xl mx-auto">
        <p className="my-4">
          All images are under{' '}
          <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">
            Creative Commons BY-NC-SA
          </a>{' '}
          license, and are free for non-commercial use.
        </p>
      </div>
    </>
  );
}
