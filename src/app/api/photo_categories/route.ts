import { PHOTO_CATEGORY_QUERY } from '@/queries/queries';
import { photoCategorySchema } from '@/schemas/photos';
import { sanityClient } from '@/utils/sanity.server';

export async function GET() {
  const photoCategories = photoCategorySchema
    .array()
    .parse(await sanityClient.fetch(PHOTO_CATEGORY_QUERY));

  return Response.json(photoCategories);
}
