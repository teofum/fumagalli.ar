import { type V2_MetaFunction } from '@remix-run/react';

import Button, { LinkButton } from '~/components/ui/Button';
import RetroLink from '~/components/ui/Link';
import Close from '~/components/ui/icons/Close';

export const meta: V2_MetaFunction = () => {
  return [
    { title: 'Teo Fumagalli' },
    { name: 'description', content: 'Welcome to my site!' },
  ];
};

const resources = '/fs/Applications/intro/resources';

export default function AboutRoute() {
  return (
    <main className="p-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-surface bevel-window p-1 flex flex-col font-sans text-base">
          <div className="select-none flex flex-row items-center gap-2 px-0.5 py-px mb-0.5">
            <img src={`/fs/Applications/intro/icon_16.png`} alt="" />

            <div className="flex-1 h-1.5 border-t border-b border-light" />

            <span className="text-title bold">About Me</span>

            <div className="flex-1 h-1.5 border-t border-b border-light" />

            <Button>
              <Close />
            </Button>
          </div>

          <div className="bg-default bevel-content p-0.5 flex flex-col sm:flex-row gap-2">
            <div className="flex flex-col flex-1 p-4 sm:p-8 gap-2">
              <p className="font-display-text text-xl">Hi there! My name is</p>
              <h1 className="font-display text-4xl">
                <span className="tracking-[-3px]">T</span>eo{' '}
                <span className="tracking-[-2px]">F</span>umaga
                <span className="tracking-[-9px] -ml-1.5">lli</span>
              </h1>
              <p className="font-display-text text-xl max-w-[55ch]">
                and I'm a web developer and designer based in Buenos Aires,
                Argentina. I make cool stuff for the web, and I'm passionate
                about exploring new possibilities and pushing the limits of what
                websites can do.
              </p>

              <p className="font-display-text text-xl max-w-[55ch]">
                You can check out my stuff below:
              </p>

              <div className="flex flex-row gap-1">
                <LinkButton to="/articles" className="py-1 px-2 w-20">
                  <div className="flex flex-col items-center gap-1 pt-1">
                    <img src={`${resources}/articles.png`} alt="" />
                    Articles
                  </div>
                </LinkButton>
                <LinkButton to="/photos" className="py-1 px-2 w-20">
                  <div className="flex flex-col items-center gap-1 pt-1">
                    <img src={`${resources}/photos.png`} alt="" />
                    Photos
                  </div>
                </LinkButton>
                <LinkButton to="/projects" className="py-1 px-2 w-20">
                  <div className="flex flex-col items-center gap-1 pt-1">
                    <img src={`${resources}/projects.png`} alt="" />
                    Projects
                  </div>
                </LinkButton>
              </div>

              <p className="font-display-text text-xl mt-auto pt-8">
                Let's build awesome things together!{' '}
                <RetroLink href="mailto:teo.fum@outlook.com">
                  Get&nbsp;in&nbsp;touch
                </RetroLink>
              </p>

              <p className="font-display-text text-xl">
                You can also find me on{' '}
                <RetroLink href="https://github.com/teofum">GitHub</RetroLink>{' '}
                and{' '}
                <RetroLink href="https://codepen.io/teofum">CodePen</RetroLink>.
              </p>
            </div>

            <img
              src={`${resources}/me.png`}
              alt="me"
              className="self-end mt-6"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
