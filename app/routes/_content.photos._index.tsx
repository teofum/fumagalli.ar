import { useEffect, useState } from 'react';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import * as Collapsible from '@radix-ui/react-collapsible';

import { sanityClient } from '~/utils/sanity.server';
import { photoCategorySchema } from '~/schemas/photos';
import { sanityImage } from '~/utils/sanity.image';
import { PHOTO_CATEGORY_QUERY } from '~/queries/queries';

export async function loader() {
  const data = await photoCategorySchema
    .array()
    .promise()
    .parse(sanityClient.fetch(PHOTO_CATEGORY_QUERY));

  return json(data);
}

export default function PhotosIndexRoute() {
  const data = useLoaderData<typeof loader>();

  const [dpr, setDpr] = useState(1);

  useEffect(() => {
    setDpr(window.devicePixelRatio);
  }, []);

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-title text-content-4xl sm:text-content-6xl mb-8">
        Photography
      </h1>

      <p className="my-4">
        Some of my work as a hobby photographer. Click any photo to view full
        size.
      </p>

      <div className="grid grid-cols-1">
        {data.map((category) => (
          <Collapsible.Root className="flex flex-col">
            <Collapsible.Trigger className="group border-b border-current p-4 hover:bg-[rgb(from_currentcolor_r_g_b/20%)] transition-colors duration-200">
              <div className="flex flex-row items-center justify-between">
                <div>{category.title}</div>
                <svg stroke="currentColor"
                     fill="currentColor"
                     className="group-data-[state='open']:rotate-180 transition-transform duration-200"
                     strokeWidth="0"
                     viewBox="0 0 256 256"
                     height="24px"
                     width="24px"
                     xmlns="http://www.w3.org/2000/svg">
                  <path d="M216.49,104.49l-80,80a12,12,0,0,1-17,0l-80-80a12,12,0,0,1,17-17L128,159l71.51-71.52a12,12,0,0,1,17,17Z" />
                </svg>
              </div>
            </Collapsible.Trigger>

            <Collapsible.Content className="group/category">
              <div className="grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] group-data-[state='open']/category:pt-3 gap-3">
                {category.collections.map(collection => (
                  <a key={collection._id}
                     className="block relative overflow-hidden group"
                     href={`photos/${collection.slug}`}>
                    <img
                      className="absolute inset-0 w-full h-full object-cover [image-rendering:auto]"
                      alt=""
                      src={collection.thumbnail.lqip}
                    />

                    <img
                      className="relative w-full aspect-[3/2] group-hover:scale-[1.05] transition-transform duration-200"
                      alt=""
                      src={sanityImage(collection.thumbnail.content).width(524).dpr(dpr).quality(80).url()}
                      loading="lazy"
                    />

                    <div className="absolute left-0 bottom-0 w-full bg-default/20 pixelate-bg py-3 px-6 text-white">
                      {collection.title}
                    </div>
                  </a>
                ))}
              </div>
            </Collapsible.Content>
          </Collapsible.Root>
        ))}
      </div>

      <p className="my-4">
        All images are under{' '}
        <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">
          Creative Commons BY-NC-SA
        </a>{' '}
        license, and are free for non-commercial use.
      </p>
    </div>
  );
}
