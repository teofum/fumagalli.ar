import { PHOTOS_QUERY } from '@/queries/queries';
import { Photo, photoSchema } from '@/schemas/photos';
import { sanityClient } from '@/utils/sanity.server';
import { SearchParams, ServerComponentProps } from '@/utils/types';

import { fetchTags } from '../fetch-tags';
import Filters from './filters';
import Collapsible from '@/components/pages/Collapsible';
import { fetchExifStats } from '../fetch-exif-stats';
import { PhotoThumbnail } from '../photo-thumbnail';

const DEFAULT_SORT_MODE: Record<string, 'desc' | 'asc'> = {
  date: 'desc',
  filename: 'asc',
};

const sortFn: Record<string, (a: Photo, b: Photo) => number> = {
  date: (a, b) =>
    (a.metadata.exif.dateTime?.getTime() ?? 0) -
    (b.metadata.exif.dateTime?.getTime() ?? 0),
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
        className="mb-6 sticky top-0 z-100 bg-default"
      >
        <Filters tags={tags} defaultValues={filters} exif={exif} />
      </Collapsible>

      <div className="grid grid-cols-2 gap-2">
        {photos.map((photo) => (
          <PhotoThumbnail
            key={photo._id}
            photo={photo}
            href="/photos/detail/{id}"
          />
        ))}
      </div>
    </div>
  );
}
