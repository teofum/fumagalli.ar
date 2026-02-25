import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import z from 'zod';

import { PHOTO_BY_IDX_QUERY, PHOTO_COUNT_QUERY } from '@/queries/queries';
import { photoSchema } from '@/schemas/photos';
import { sanityImage } from '@/utils/sanity.image';
import { sanityClient } from '@/utils/sanity.server';

import fetchArticles from '../articles/fetch-articles';
import { PhotoThumbnail } from '../photos/photo-thumbnail';
import ArticleItem from '../article-item';
import Webring from '@/components/ui/Webring';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

// Revalidate the page once every hour, this ensures content is reasonably fresh
export const revalidate = 3600;

export default async function Home() {
  const articles = await fetchArticles();
  const latestArticle = articles[0];

  const today = Math.floor(new Date().getTime() / MS_PER_DAY);
  const hash = today ^ (0x9e3779b9 + (today << 6) + (today >> 2));

  const count = z.number().parse(await sanityClient.fetch(PHOTO_COUNT_QUERY));
  const photoOfTheDay = photoSchema.parse(
    await sanityClient.fetch(PHOTO_BY_IDX_QUERY(hash % count)),
  );

  return (
    <main className="p-4">
      <div className="max-w-3xl mx-auto pb-16">
        <p className="text-content-sm">Hi there! My name is</p>
        <h1 className="font-title text-content-5xl md:text-content-6xl mt-2 mb-4">
          Teo Fumagalli
        </h1>
        <p className="text-content-sm">
          I&apos;m a programmer, UI designer and amateur photographer based in
          Buenos Aires, Argentina. I do a bit of everything, but my professional
          background is in web development and my primary interest in rendering
          and graphics programming.
        </p>

        <h2 className="text-content-lg md:text-content-xl font-semibold mb-2 mt-8">
          Photo of the day
        </h2>

        <PhotoThumbnail
          photo={photoOfTheDay}
          href="/photos/detail/{id}"
          width={768}
          height={512}
          quality={90}
        />

        <Link
          href="/photos"
          className="flex flex-row items-center justify-between p-4 hover:bg-current/20 border-b font-medium"
        >
          <span>Photography</span>
          <ChevronRight size={20} />
        </Link>

        <h2 className="text-content-lg md:text-content-xl font-semibold mb-2 mt-8">
          Latest article
        </h2>

        <div className="border-b">
          <ArticleItem post={latestArticle} />
        </div>

        <Link
          href="/articles"
          className="flex flex-row items-center justify-between p-4 hover:bg-current/20 border-b font-medium"
        >
          <span>Blog</span>
          <ChevronRight size={20} />
        </Link>

        <Link
          href="/projects"
          className="flex flex-row items-center justify-between p-4 hover:bg-current/20 border-b font-medium"
        >
          <span>Work</span>
          <ChevronRight size={20} />
        </Link>

        <div className="mt-8 flex flex-col items-center gap-2">
          <p className="text-content-sm">
            This site is part of the following webrings:
          </p>
          <Webring
            indexUrl="https://graphics-programming.org/webring"
            baseUrl="https://graphics-programming.org/webring/frogs/bluescreen"
            iconUrl="/assets/misc/froge.webp"
          />
        </div>
      </div>
    </main>
  );
}
