import { sanityClient } from '@/utils/sanity.server';
import { photoCollectionSchema } from '@/schemas/photos';
import { PHOTO_COLLECTION_QUERY } from '@/queries/queries';
import PhotoGallery from './photo-gallery.tsx';

export default async function PhotosCategory({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!slug) throw new Error('TODO 404 handling');

  const data = photoCollectionSchema.parse(
    await sanityClient.fetch(PHOTO_COLLECTION_QUERY(slug)),
  );

  return <PhotoGallery data={data} />;
}
