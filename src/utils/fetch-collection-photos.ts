import { PHOTOS_QUERY } from '@/queries/queries';
import { PhotoCollection, photoSchema } from '@/schemas/photos';
import { sanityClient } from '@/utils/sanity.server';
import { SearchParams } from '@/utils/types';

export async function fetchCollectionPhotos(collection: PhotoCollection) {
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
