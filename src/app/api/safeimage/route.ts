import { imageFileSchema } from '@/schemas/file';
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

  const response = await sanityClient.fetch(fileQuery(fileId));
  const data = imageFileSchema.parse(response);

  const imageUrl = sanityImage(data.content).width(2000).url();
  return fetch(imageUrl);
}
