import {
  PHOTO_COLLECTION_QUERY,
  PHOTO_COLLECTIONS_QUERY,
} from '@/queries/queries';
import folderSchema, { Folder } from '@/schemas/folder';
import {
  photoCollectionBaseSchema,
  photoCollectionSchema,
} from '@/schemas/photos';
import { sanityClient } from '@/utils/sanity.server';
import { fetchCollectionPhotos } from '@/utils/fetch-collection-photos';

const folderQuery = (id: string = 'root') => `
*[_type == "folder" && _id == "${id}"][0] {
  ...,
  "parent": *[_type == "folder" && references(^._id)][0] {
    ...,
    "parent": *[_type == "folder" && references(^._id)][0] {
      ...,
      "parent": *[_type == "folder" && references(^._id)][0],
    },
  },
  items[]-> {
    _id,
    _type,
    _createdAt,
    _updatedAt,
    name,
    icon,
    'size': content.asset->size,
  }
}`;

const PHOTOS_ROOT_ID = '8af5f1da-51b7-402b-a786-596687ff4fc9';

/*
 * Fetch fake-fs folders by id
 */
async function fetchFolder(folderId: string) {
  const raw = await sanityClient.fetch(folderQuery(folderId));
  const folder = folderSchema.parse({ ...raw, items: raw.items ?? [] });

  /*
   * Special handling for photos root folder
   */
  if (folder._id === PHOTOS_ROOT_ID) {
    // Fetch all photo collections
    const collections = photoCollectionBaseSchema
      .array()
      .parse(await sanityClient.fetch(PHOTO_COLLECTIONS_QUERY));

    // Convert them to "fake folders" to be displayed by the file manager
    folder.items = collections.map((collection) => ({
      _id: `@photo_collection:${collection.slug}`,
      _type: 'folder',
      _createdAt: collection._createdAt,
      _updatedAt: collection._updatedAt,
      name: collection.title,
    }));
  }

  return folder;
}

/*
 * Dynamically create folders from a photo collection
 */
async function fetchPhotoCollection(slug: string) {
  const collection = photoCollectionSchema.parse(
    await sanityClient.fetch(PHOTO_COLLECTION_QUERY(slug)),
  );

  const photos = await fetchCollectionPhotos(collection);
  photos.sort(
    (a, b) =>
      (a.metadata.exif.dateTime?.getTime() ?? 0) -
      (b.metadata.exif.dateTime?.getTime() ?? 0),
  );

  const parentFolder = await fetchFolder(PHOTOS_ROOT_ID);
  const folder: Folder = {
    _id: `@photo_collection:${slug}`,
    _type: 'folder',
    _createdAt: collection._createdAt,
    _updatedAt: collection._updatedAt,
    name: collection.title,
    parent: parentFolder,

    items: photos.map((photo) => ({
      _id: `@photo:${photo._id}`,
      _type: 'fileImage',
      _createdAt:
        photo.metadata.exif.dateTime?.toISOString() ||
        '1970-01-01T00:00:00.000Z',
      _updatedAt:
        photo.metadata.exif.dateTime?.toISOString() ||
        '1970-01-01T00:00:00.000Z',
      name: photo.originalFilename,
      size: photo.size,
    })),
  };

  return folder;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const folderId = url.searchParams.get('id') ?? 'root';

  if (folderId.startsWith('@')) {
    const [type, id] = folderId.slice(1).split(':');

    switch (type) {
      case 'photo_collection':
        const folder = await fetchPhotoCollection(id);
        console.log(folder);
        return Response.json(folder);
      default:
        throw new Error('Invalid resource type');
    }
  } else {
    const folder = await fetchFolder(folderId);
    console.log(folder);
    return Response.json(folder);
  }
}
