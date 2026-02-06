import Link from 'next/link';
import z from 'zod';

import {
  PHOTO_BY_IDX_QUERY,
  PHOTO_COUNT_QUERY,
  PHOTOS_QUERY,
} from '@/queries/queries';
import { Photo, photoSchema } from '@/schemas/photos';
import { sanityImage } from '@/utils/sanity.image';
import { sanityClient } from '@/utils/sanity.server';
import { SearchParams, ServerComponentProps } from '@/utils/types';

import { fetchTags } from './fetch-tags';
import Collapsible from '@/components/pages/Collapsible';
import { PhotoThumbnail } from './photo-thumbnail';
import { ChevronRight } from 'lucide-react';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export default async function Photos() {
  const tags = await fetchTags();

  const today = Math.floor(new Date().getTime() / MS_PER_DAY);
  const hash = today ^ (0x9e3779b9 + (today << 6) + (today >> 2));

  const count = z.number().parse(await sanityClient.fetch(PHOTO_COUNT_QUERY));
  const photoOfTheDay = photoSchema.parse(
    await sanityClient.fetch(PHOTO_BY_IDX_QUERY(hash % count)),
  );

  const featuredPhotos = photoSchema
    .array()
    .parse(await sanityClient.fetch(PHOTOS_QUERY({ _tag: 'featured' })));

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-title text-content-4xl sm:text-content-6xl mb-8">
        Photography
      </h1>

      <div className="flex flex-col gap-2">
        <div className="">
          <h2 className="text-content-xl sm:text-content-2xl font-semibold mb-2 mt-4">
            Featured photos
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {featuredPhotos.slice(0, 4).map((photo) => (
              <PhotoThumbnail
                key={photo._id}
                photo={photo}
                hrefPrefix="photos/"
              />
            ))}
          </div>
        </div>

        <Link
          href="/photos/gallery"
          className="flex flex-row items-center justify-between p-4 hover:bg-current/20 border-b font-medium"
        >
          <span>View all photos</span>
          <ChevronRight size={20} />
        </Link>

        <div className="">
          <h2 className="text-content-xl sm:text-content-2xl font-semibold mb-2 mt-4">
            Photo of the day
          </h2>
          <PhotoThumbnail
            photo={photoOfTheDay}
            hrefPrefix="photos/"
            width={768}
            height={512}
            quality={90}
          />
        </div>

        <div className="">
          <h2 className="text-content-xl sm:text-content-2xl font-semibold mb-2 mt-4">
            Categories
          </h2>

          <Collapsible title="Places" className="bg-default backdrop-blur-lg">
            {tags.place.map((tag) => (
              <div key={tag}>{tag}</div>
            ))}
          </Collapsible>
          <Collapsible title="Subjects" className="bg-default backdrop-blur-lg">
            {tags.subject.map((tag) => (
              <div key={tag}>{tag}</div>
            ))}
          </Collapsible>
        </div>
      </div>
    </div>
  );
}
