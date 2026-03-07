import { NextRequest } from 'next/server';

import getSortFn from '@/app/(pages)/photos/sort';
import { PHOTOS_QUERY } from '@/queries/queries';
import { photoSchema } from '@/schemas/photos';
import { sanityClient } from '@/utils/sanity.server';
import { SearchParams } from '@/utils/types';

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams;

  const sort = search.get('sort');
  const filters: SearchParams = {};
  for (const [key, value] of search.entries()) {
    if (key != 'sort') {
      filters[key] = [...(filters[key] ?? []), value];
    }
  }

  const photos = photoSchema
    .array()
    .parse(await sanityClient.fetch(PHOTOS_QUERY(filters)));

  photos.sort(getSortFn(sort ?? undefined));

  return Response.json(photos);
}
