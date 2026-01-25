import { sanityClient } from '@/utils/sanity.server';
import { photoCategorySchema } from '@/schemas/photos';
import { sanityImage } from '@/utils/sanity.image';
import { PHOTO_CATEGORY_QUERY } from '@/queries/queries';
import Collapsible from '@/components/pages/Collapsible';
import Link from 'next/link';

export default async function Photos() {
  const data = photoCategorySchema
    .array()
    .parse(await sanityClient.fetch(PHOTO_CATEGORY_QUERY));

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
          <Collapsible key={category._id} title={category.title}>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] group-data-[state='open']/content:pt-3 gap-3">
              {category.collections.map((collection) => (
                <Link
                  key={collection._id}
                  href={`photos/${collection.slug}`}
                  className="block relative overflow-hidden group"
                >
                  <img
                    className="absolute inset-0 w-full h-full object-cover [image-rendering:auto]"
                    alt=""
                    src={collection.thumbnail.lqip ?? undefined}
                  />

                  <img
                    className="relative w-full aspect-3/2 group-hover:scale-[1.05] transition-transform duration-200"
                    alt=""
                    src={sanityImage(collection.thumbnail.content)
                      .width(524)
                      .dpr(2)
                      .quality(80)
                      .url()}
                    loading="lazy"
                  />

                  <div className="absolute left-0 bottom-0 w-full bg-default/20 pixelate-bg py-3 px-6 text-white">
                    {collection.title}
                  </div>
                </Link>
              ))}
            </div>
          </Collapsible>
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
