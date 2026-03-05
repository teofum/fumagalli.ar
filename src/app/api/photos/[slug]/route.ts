import { NextRequest } from 'next/server';

import getSortFn from '@/app/(pages)/photos/sort';
import { PHOTO_COLLECTION_QUERY } from '@/queries/queries';
import { photoCollectionSchema } from '@/schemas/photos';
import { fetchCollectionPhotos } from '@/utils/fetch-collection-photos';
import { sanityClient } from '@/utils/sanity.server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const search = request.nextUrl.searchParams;

  const sort = search.get('sort');
  const { slug } = await params;

  const collection = photoCollectionSchema.parse(
    await sanityClient.fetch(PHOTO_COLLECTION_QUERY(slug)),
  );

  const photos = await fetchCollectionPhotos(collection);
  photos.sort(getSortFn(sort ?? undefined));

  return Response.json(photos);
}
