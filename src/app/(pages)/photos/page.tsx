import Link from 'next/link';

import { PHOTOS_QUERY } from '@/queries/queries';
import { Photo, photoSchema } from '@/schemas/photos';
import { sanityImage } from '@/utils/sanity.image';
import { sanityClient } from '@/utils/sanity.server';
import { SearchParams, ServerComponentProps } from '@/utils/types';

import { fetchTags } from './fetch-tags';
import Filters from './filters';
import Collapsible from '@/components/pages/Collapsible';
import { fetchExifStats } from './fetch-exif-stats';

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

  const photos = photoSchema
    .array()
    .parse(await sanityClient.fetch(PHOTOS_QUERY(filters)));

  photos.sort(getSortFn(sort));

  const tags = await fetchTags();
  const exif = await fetchExifStats();

  const filterCount = Object.keys(filters).length;
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-title text-content-4xl sm:text-content-6xl mb-8">
        Photography
      </h1>

      <p className="mb-4">
        My work as an amateur photographer. Click on any image for a detail
        view.
      </p>

      <Collapsible
        title={`Filters ${filterCount ? `(${filterCount})` : ''}`}
        className="mb-6 sticky top-0 z-100 bg-default backdrop-blur-lg"
      >
        <Filters tags={tags} defaultValues={filters} exif={exif} />
      </Collapsible>

      <div className="grid grid-cols-2 gap-2">
        {photos.map((photo) => (
          <Link
            key={photo._id}
            href={`photos/${photo._id}`}
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
                .width(480)
                .height(320)
                .dpr(2)
                .quality(80)
                .url()}
              loading="lazy"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
