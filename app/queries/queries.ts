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