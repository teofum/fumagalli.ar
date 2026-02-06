import { PHOTOS_QUERY, PHOTO_COLLECTION_QUERY } from '@/queries/queries';
import {
  PhotoCollection,
  photoCollectionSchema,
  photoSchema,
} from '@/schemas/photos';
import { sanityClient } from '@/utils/sanity.server';
import { SearchParams, ServerComponentProps } from '@/utils/types';

import { PhotoThumbnail } from '../photo-thumbnail';
import getSortFn from '../sort';

async function fetchCollectionPhotos(collection: PhotoCollection) {
  switch (collection.type) {
    case 'photos': {
      return collection.photos ?? [];
    }
    case 'filters': {
      const filters: SearchParams = {};
      for (const filter of collection.filters ?? []) {
        filters[filter.tag] = filter.values;
      }

      return photoSchema
        .array()
        .parse(await sanityClient.fetch(PHOTOS_QUERY(filters)));
    }
  }
}

export default async function PhotoCollectionPage({
  params,
  searchParams,
}: ServerComponentProps) {
  const { slug } = await params;
  const { sort } = await searchParams;

  if (typeof slug !== 'string') return null; // TODO 404

  const collection = photoCollectionSchema.parse(
    await sanityClient.fetch(PHOTO_COLLECTION_QUERY(slug)),
  );

  const photos = await fetchCollectionPhotos(collection);
  photos.sort(getSortFn(sort));

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-title text-content-4xl sm:text-content-6xl mb-8">
        {collection.title}
      </h1>

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
