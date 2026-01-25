import fileSchema from '@/schemas/file';
import { sanityClient } from '@/utils/sanity.server';

const fileQuery = (id: string) => `
*[_type != "folder" && _id == "${id}"][0] {
  ...,
  'size': content.asset->size,
  'lqip': content.asset->metadata.lqip,
  'dimensions': content.asset->metadata.dimensions,
}`;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const fileId = url.searchParams.get('id') ?? '';

  const response = await sanityClient.fetch(fileQuery(fileId));
  const data = fileSchema.parse(response);

  return Response.json(data);
}
