import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { imageFileSchema } from '~/schemas/file';
import { sanityImage } from '~/utils/sanity.image';
import { sanityClient } from '~/utils/sanity.server';

// TODO this is a *huge* query, should add pagination or something...
const PHOTOS_QUERY = `
*[_type == "fileImage"] {
  ...,
  'size': content.asset->size,
  'lqip': content.asset->metadata.lqip,
  'dimensions': content.asset->metadata.dimensions,
  'originalFilename': content.asset->originalFilename,
}`;

export async function loader() {
  const data = await imageFileSchema
    .array()
    .promise()
    .parse(sanityClient.fetch(PHOTOS_QUERY));

  data.sort((a, b) => {
    const aFilename = a.originalFilename?.replace('_', '') ?? '';
    const bFilename = b.originalFilename?.replace('_', '') ?? '';

    return aFilename > bFilename ? -1 : 1;
  });

  return json(data);
}

export default function PhotosIndexRoute() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-title text-content-4xl sm:text-content-6xl mb-8">
        Photography
      </h1>

      <p className="mb-4">
        Some of my work as a hobby photographer. Click any photo to view full
        size.
      </p>

      <p className="mb-4">
        All images are under{' '}
        <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">
          Creative Commons BY-NC-SA
        </a>{' '}
        license, and are free for non-commercial use.
      </p>

      <div className="grid grid-cols-1 gap-4">
        {data.map((photo) => (
          <a
            key={photo._id}
            className="block relative"
            href={sanityImage(photo.content).quality(100).url()}
          >
            <img
              className="absolute inset-0 w-full h-full object-cover [image-rendering:auto]"
              alt=""
              src={photo.lqip}
            />

            <img
              className="relative"
              alt=""
              src={sanityImage(photo.content).width(1000).quality(80).url()}
              loading="lazy"
            />
          </a>
        ))}
      </div>
    </div>
  );
}
