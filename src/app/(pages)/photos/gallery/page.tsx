import Collapsible from '@/components/pages/Collapsible';
import { PHOTOS_QUERY } from '@/queries/queries';
import { photoSchema } from '@/schemas/photos';
import { sanityClient } from '@/utils/sanity.server';
import { ServerComponentProps } from '@/utils/types';

import { fetchExifStats } from '../fetch-exif-stats';
import { fetchTags } from '../fetch-tags';
import { PhotoThumbnail } from '../photo-thumbnail';
import getSortFn from '../sort';
import Filters from './filters';

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
