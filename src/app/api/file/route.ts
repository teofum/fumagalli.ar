import { PHOTO_QUERY } from '@/queries/queries';
import fileSchema, { ImageFile } from '@/schemas/file';
import { photoSchema } from '@/schemas/photos';
import { sanityClient } from '@/utils/sanity.server';

const fileQuery = (id: string) => `
*[_type != "folder" && _id == "${id}"][0] {
  ...,
  'size': content.asset->size,
  'lqip': content.asset->metadata.lqip,
  'dimensions': content.asset->metadata.dimensions,
}`;

async function fetchPhoto(id: string) {
  const photo = photoSchema.parse(await sanityClient.fetch(PHOTO_QUERY(id)));

  const file: ImageFile = {
    _id: `@photo:${id}`,
    _type: 'fileImage',
    _createdAt:
      photo.metadata.exif.dateTime?.toISOString() || '1970-01-01T00:00:00.000Z',
    _updatedAt:
      photo.metadata.exif.dateTime?.toISOString() || '1970-01-01T00:00:00.000Z',
    name: photo.originalFilename,
    size: photo.size,
    dimensions: photo.metadata.dimensions,

    content: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: id,
      },
    },
  };

  return file;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const fileId = url.searchParams.get('id') ?? '';

  /*
   * Handle dynamically generated "fake" file resources
   */
  if (fileId.startsWith('@')) {
    const [type, id] = fileId.slice(1).split(':');

    switch (type) {
      case 'photo':
        const file = await fetchPhoto(id);
        console.log(file);
        return Response.json(file);
      default:
        throw new Error('Invalid resource type');
    }
  } else {
    const response = await sanityClient.fetch(fileQuery(fileId));
    const file = fileSchema.parse(response);
    return Response.json(file);
  }
}
