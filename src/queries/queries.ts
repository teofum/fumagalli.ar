import { SearchParams } from '@/utils/types';

export const IMAGE_QUERY = ` {
...,
'lqip': asset->metadata.lqip,
'dimensions': asset->metadata.dimensions,
'originalFilename': asset->originalFilename,
}`;

export const PHOTO_CATEGORY_QUERY = `
*[_type == "photoCategory"] {
  ...,
  collections[]-> {
    _type,
    _id,
    title,
    'slug': slug.current,
    thumbnail ${IMAGE_QUERY},
  },
}`;

export const PHOTO_COLLECTION_QUERY = (slug: string) => `
*[_type == "photoCollection" && slug.current == "${slug}"][0] {
  _type,
  _id,
  title,
  'slug': slug.current,
  thumbnail ${IMAGE_QUERY},
  photos[] ${IMAGE_QUERY},
  filters[],
}`;

export const PHOTOS_QUERY = (filters: SearchParams) => {
  const filterStrings = Object.entries(filters).map(([filter, value]) => {
    if (!value) return '';

    const values = typeof value === 'string' ? [value] : value;
    const tagValueArray = `[${values.map((v) => `'${filter}:${v}'`).join(', ')}]`;

    const filterString = `references(*[_type == 'media.tag' && name.current in ${tagValueArray}]._id)`;

    // Special handling for lens filter, which uses a combination of tags and EXIF data
    if (filter === 'lens') {
      const exifValueArray = `[${values.map((v) => `'${v}'`).join(', ')}]`;
      return `&& (${filterString} || metadata.exif.LensModel in ${exifValueArray})`;
    }

    return `&& ${filterString}`;
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

export const PHOTO_COUNT_QUERY = `
count(*[_type == "sanity.imageAsset" && references(*[_type == 'media.tag' && name.current == 'type:Photo']._id)])
`;

export const PHOTO_BY_IDX_QUERY = (idx: number) => `
*[_type == "sanity.imageAsset" && references(*[_type == 'media.tag' && name.current == 'type:Photo']._id)][${idx}] {
  ...,
  'tags': opt.media.tags[]->name.current,
}
`;

export const EXIF_QUERY = `
*[_type == "sanity.imageAsset" && references(*[_type == 'media.tag' && name.current == 'type:Photo']._id)].metadata.exif
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
