import { PHOTO_QUERY } from '@/queries/queries';
import { imageFileSchema } from '@/schemas/file';
import { photoSchema } from '@/schemas/photos';
import { sanityImage } from '@/utils/sanity.image';
import { sanityClient } from '@/utils/sanity.server';

const fileQuery = (id: string) => `
*[_type == "fileImage" && _id == "${id}"][0] {
  ...,
  content {
    ...,
  },
  'size': content.asset->size,
  'lqip': content.asset->metadata.lqip,
  'dimensions': content.asset->metadata.dimensions,
}`;

// Loads an image file through the server, preventing canvases from becoming tainted
export async function GET(request: Request) {
  const url = new URL(request.url);
  const fileId = url.searchParams.get('id') ?? '';

  if (fileId.startsWith('@')) {
    const [type, id] = fileId.slice(1).split(':');
    switch (type) {
      case 'photo':
        const photo = photoSchema.parse(
          await sanityClient.fetch(PHOTO_QUERY(id)),
        );

        const imageUrl = sanityImage(photo._id).width(2000).quality(100).url();
        return fetch(imageUrl);
      default:
        throw new Error('Invalid resource type');
    }
  } else {
    const data = imageFileSchema.parse(
      await sanityClient.fetch(fileQuery(fileId)),
    );

    const imageUrl = sanityImage(data.content).width(2000).quality(100).url();
    return fetch(imageUrl);
  }
}
