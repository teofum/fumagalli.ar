import { PHOTO_COLLECTION_QUERY } from '@/queries/queries';
import { photoCollectionSchema } from '@/schemas/photos';
import { fetchCollectionPhotos } from '@/utils/fetch-collection-photos';
import { sanityClient } from '@/utils/sanity.server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  const collection = photoCollectionSchema.parse(
    await sanityClient.fetch(PHOTO_COLLECTION_QUERY(slug)),
  );

  const photos = await fetchCollectionPhotos(collection);

  return Response.json(photos);
}
