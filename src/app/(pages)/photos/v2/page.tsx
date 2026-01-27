import Link from 'next/link';

import { PHOTOS_QUERY } from '@/queries/queries';
import { Photo, photoSchema } from '@/schemas/photos';
import { sanityImage } from '@/utils/sanity.image';
import { sanityClient } from '@/utils/sanity.server';
import { SearchParams, ServerComponentProps } from '@/utils/types';

import { fetchTags } from './use-tags';

const DEFAULT_SORT_MODE: Record<string, 'desc' | 'asc'> = {
  date: 'desc',
  filename: 'asc',
};

const sortFn: Record<string, (a: Photo, b: Photo) => number> = {
  date: (a, b) =>
    a.metadata.exif.dateTime.getTime() - b.metadata.exif.dateTime.getTime(),
  filename: (a, b) => a.originalFilename.localeCompare(b.originalFilename),
};

function getSortFn(sort: SearchParams[string]) {
  const [sortBy, sortMode] =
    typeof sort === 'string' ? sort.split(',') : ['date', 'desc'];

  const fn = sortFn[sortBy];
  const mode = sortMode ?? DEFAULT_SORT_MODE[sortBy] ?? 'asc';

  return mode === 'desc' ? (a: Photo, b: Photo) => fn(b, a) : fn;
}

export default async function Photos({ searchParams }: ServerComponentProps) {
  const { sort, ...filters } = await searchParams;

  const query = PHOTOS_QUERY(filters);
  console.log(query);
  const photos = photoSchema.array().parse(await sanityClient.fetch(query));

  photos.sort(getSortFn(sort));

  const allTags = await fetchTags();

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-title text-content-4xl sm:text-content-6xl mb-8">
        Photography
      </h1>

      {Object.entries(allTags).map(([group, tags]) => (
        <div key={group}>
          {group}: {tags.join(', ')}
        </div>
      ))}

      <p className="my-4">
        Some of my work as a hobby photographer. Click any photo to view full
        size.
      </p>

      <div className="grid grid-cols-2">
        {photos.map((photo) => (
          <Link
            key={photo._id}
            href={`v2`}
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
              src={sanityImage(photo._id).width(524).dpr(2).quality(80).url()}
              loading="lazy"
            />

            <div className="absolute left-0 bottom-0 w-full bg-default/20 pixelate-bg py-3 px-6 text-white">
              {photo.originalFilename}{' '}
              {photo.metadata.exif.dateTime.toLocaleDateString()}
            </div>
          </Link>
        ))}
      </div>

      <p className="my-4">
        All images are under{' '}
        <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">
          Creative Commons BY-NC-SA
        </a>{' '}
        license, and are free for non-commercial use.
      </p>
    </div>
  );
}
