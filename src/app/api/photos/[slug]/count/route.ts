import { NextRequest } from 'next/server';
import z from 'zod';

import { PHOTO_COLLECTION_QUERY, PHOTOS_QUERY } from '@/queries/queries';
import { photoCollectionSchema } from '@/schemas/photos';
import { sanityClient } from '@/utils/sanity.server';
import { SearchParams } from '@/utils/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  const collection = photoCollectionSchema.parse(
    await sanityClient.fetch(PHOTO_COLLECTION_QUERY(slug)),
  );

  let count = 0;
  switch (collection.type) {
    case 'photos': {
      count = collection.photos?.length ?? 0;
    }
    case 'filters': {
      const filters: SearchParams = {};
      for (const filter of collection.filters ?? []) {
        filters[filter.tag] = filter.values;
      }

      count = z
        .number()
        .parse(await sanityClient.fetch(`count(${PHOTOS_QUERY(filters)})`));
    }
  }

  return Response.json(count);
}
