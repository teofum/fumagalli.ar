import Image from 'next/image';

import Button, { LinkButton } from '@/components/ui/Button';
import Close from '@/components/ui/icons/Close';
import RetroLink from '@/components/ui/Link';
import Webring from '@/components/ui/Webring';

const resources = '/fs/Applications/intro/resources';

export default function Home() {
  return (
    <main className="p-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-surface bevel-window p-1 flex flex-col font-sans text-base">
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
        </div>
      </div>
    </main>
  );
}
