import { SearchParams } from '@/utils/types';

export const IMAGE_FILE_QUERY = ` {
...,
'lqip': content.asset->metadata.lqip,
'dimensions': content.asset->metadata.dimensions,
'originalFilename': content.asset->originalFilename,
}`;

export const PHOTO_CATEGORY_QUERY = `
*[_type == "photoCategory"] {
  ...,
  thumbnail-> ${IMAGE_FILE_QUERY},
  collections[]-> {
    _type,
    _id,
    title,
    'slug': slug.current,
    thumbnail-> ${IMAGE_FILE_QUERY},
  },
}`;

export const PHOTO_COLLECTION_QUERY = (slug: string) => `
*[_type == "photoCollection" && slug.current == "${slug}"][0] {
  _type,
  _id,
  title,
  'slug': slug.current,
  thumbnail-> ${IMAGE_FILE_QUERY},
  photos[]-> ${IMAGE_FILE_QUERY},
}`;

export const PHOTOS_QUERY = (filters: SearchParams) => {
  const filterStrings = Object.entries(filters).map(([filter, value]) => {
    if (!value) return '';

    const values = typeof value === 'string' ? [value] : value;
    const tagValueArray = `[${values.map((v) => `'${filter}:${v}'`).join(', ')}]`;

    return `&& references(*[_type == 'media.tag' && name.current in ${tagValueArray}]._id)`;
  });

  return `
  *[_type == "sanity.imageAsset"
    && references(*[_type == 'media.tag' && name.current == 'type:Photo']._id)
    ${filterStrings.join('\n')}
  ] {
    ...,
    'tags': opt.media.tags[]->name.current,
  }
  `;
};

export const PHOTO_QUERY = (id: string) => `
*[_type == "sanity.imageAsset" && _id == "${id}"][0] {
  ...,
  'tags': opt.media.tags[]->name.current,
}
`;

export const TAGS_QUERY = `
*[_type == "media.tag"].name.current
`;

export const PROJECT_CATEGORY_QUERY = `
*[_type == "projectCategory"] {
  _id,
  _type,
  title,
  projects[]-> {
    _type,
    _id,
    name,
    slug,
    'thumbnail': file->content[_type == "image"][0] {
      ...,
      'lqip': asset->metadata.lqip,
    },
  }
}`;

export const PROJECT_QUERY = (slug: string) => `
*[_type == "project" && slug == "${slug}"][0] {
  _type,
  _id,
  name,
  slug,
  'content': file->content,
}`;
