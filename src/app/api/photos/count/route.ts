import { NextRequest } from 'next/server';
import z from 'zod';

import { PHOTOS_QUERY } from '@/queries/queries';
import { sanityClient } from '@/utils/sanity.server';
import { SearchParams } from '@/utils/types';

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams;

  const filters: SearchParams = {};
  for (const [key, value] of search.entries()) {
    if (key != 'sort') {
      filters[key] = [...(filters[key] ?? []), value];
    }
  }
  const count = z
    .number()
    .parse(await sanityClient.fetch(`count(${PHOTOS_QUERY(filters)})`));

  return Response.json(count);
}
