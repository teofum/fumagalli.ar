import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import z from 'zod';

import { PHOTO_BY_IDX_QUERY, PHOTO_COUNT_QUERY } from '@/queries/queries';
import { photoSchema } from '@/schemas/photos';
import { sanityImage } from '@/utils/sanity.image';
import { sanityClient } from '@/utils/sanity.server';

import fetchArticles from '../articles/fetch-articles';
import { PhotoThumbnail } from '../photos/photo-thumbnail';

const resources = '/fs/Applications/intro/resources';
const MS_PER_DAY = 1000 * 60 * 60 * 24;

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
          <Link
            href={`articles/${latestArticle.slug}`}
            className="flex flex-row items-center md:items-start py-2 md:px-2 gap-2 hover:bg-text/10 transition-colors"
          >
            {latestArticle.thumbnail ? (
              <img
                className="w-20 h-20"
                alt=""
                src={sanityImage(latestArticle.thumbnail)
                  .width(80)
                  .height(80)
                  .dpr(2)
                  .url()}
              />
            ) : null}
            <div className="flex flex-col p-2 grow gap-2">
              <div className="flex flex-col md:flex-row items-start md:items-baseline gap-2">
                <span className="grow font-medium text-content-base/5">
                  {latestArticle.title}
                </span>
                <div className="flex flex-row items-baseline">
                  {latestArticle.tags.map((tag) => (
                    <div
                      key={tag}
                      className="px-2 border rounded-full text-content-xs/5"
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              </div>
              <span className="w-20 text-current/60 text-content-sm">
                {latestArticle.date.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                })}
              </span>
            </div>
          </Link>
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

        {/*<div className="bg-surface bevel-window p-1 flex flex-col font-sans text-base">
          <div className="select-none flex flex-row items-center gap-2 px-0.5 py-px mb-0.5">
            <Image
              width={16}
              height={16}
              unoptimized
              src={`/fs/Applications/intro/icon_16.png`}
              alt=""
            />

            <div className="flex-1 h-1.5 border-t border-b border-light" />

            <span className="text-title bold">About Me</span>

            <div className="flex-1 h-1.5 border-t border-b border-light" />

            <Button>
              <Close />
            </Button>
          </div>

          <div className="bg-default bevel-content p-0.5 flex flex-col sm:flex-row gap-2">
            <div className="flex flex-col flex-1 p-4 gap-2">
              <p>Hi there! My name is</p>
              <h1 className="font-display text-4xl">
                <span className="tracking-[-3px]">T</span>eo{' '}
                <span className="tracking-[-2px]">F</span>umaga
                <span className="tracking-[-9px] -ml-1.5">lli</span>
              </h1>
              <p>
                I&apos;m a programmer, UI designer and amateur photographer
                based in Buenos Aires, Argentina. I do a bit of everything, but
                my professional background is in web development and my primary
                interest in rendering and graphics programming.
              </p>

              <p>
                Welcome to my site! Click on the Start button or one of the
                desktop shortcuts to begin, or check out some of my stuff:
              </p>

              <div className="flex flex-row gap-1 my-2">
                <LinkButton href="/articles" className="py-1 px-2 w-28">
                  <div className="flex flex-row items-center gap-2">
                    <Image
                      width={32}
                      height={32}
                      unoptimized
                      src={`${resources}/articles.png`}
                      alt=""
                    />
                    Articles
                  </div>
                </LinkButton>
                <LinkButton href="/photos" className="py-1 px-2 w-28">
                  <div className="flex flex-row items-center gap-2">
                    <Image
                      width={32}
                      height={32}
                      unoptimized
                      src={`${resources}/photos.png`}
                      alt=""
                    />
                    Photos
                  </div>
                </LinkButton>
                <LinkButton href="/projects" className="py-1 px-2 w-28">
                  <div className="flex flex-row items-center gap-2">
                    <Image
                      width={32}
                      height={32}
                      unoptimized
                      src={`${resources}/projects.png`}
                      alt=""
                    />
                    Projects
                  </div>
                </LinkButton>
              </div>

              <p className="mt-auto">
                Let&apos;s build awesome things together!{' '}
                <RetroLink href="mailto:teo.fum@outlook.com">
                  Get in touch
                </RetroLink>
              </p>

              <p>This site is part of the following webrings</p>
              <Webring
                indexUrl="https://graphics-programming.org/webring"
                baseUrl="https://graphics-programming.org/webring/frogs/bluescreen"
                iconUrl="/assets/misc/froge.webp"
              />
            </div>

            <Image
              width={199}
              height={400}
              unoptimized
              src={`${resources}/me2.png`}
              alt="me"
              className="self-end h-100 [image-rendering:pixelated]"
            />
          </div>
        </div>*/}
      </div>
    </main>
  );
}
