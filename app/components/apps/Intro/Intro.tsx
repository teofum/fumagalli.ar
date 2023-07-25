import useDesktopStore from '~/stores/desktop';
import Button from '~/components/ui/Button';
import { Tab, TabContent, Tabs, TabsList } from '~/components/ui/Tabs';
import { files } from '../Files';
import { help } from '../Help';

const resources = '/fs/system/Applications/intro/resources';

export default function Intro() {
  const { launch } = useDesktopStore();

  const openFolder = (path: string) => {
    launch(files({ path }));
  };

  return (
    <Tabs defaultValue="about" className="p-1.5 pt-0.5">
      <TabsList>
        <Tab value="about">About</Tab>
        <Tab value="links">Links</Tab>
      </TabsList>

      <TabContent value="about" className="p-2">
        <div className="bg-default bevel-content p-0.5 flex flex-row gap-2">
          <div className="flex flex-col flex-1 p-8 gap-2">
            <p className="font-display-text text-xl">Hi there! My name is</p>
            <h1 className="font-display text-4xl">
              <span className="tracking-[-3px]">T</span>eo{' '}
              <span className="tracking-[-2px]">F</span>umaga
              <span className="tracking-[-9px] -ml-1.5">lli</span>
            </h1>
            <p className="font-display-text text-xl">
              and I'm a web developer and designer based in Buenos Aires,
              Argentina. I make cool stuff for the web, and I'm passionate about
              exploring new possibilities and pushing the limits of what
              websites can do.
            </p>

            <p className="font-display-text text-xl">
              This is a very interactive site, so feel free to explore around,
              or check out some of my stuff:
            </p>

            <div className="flex flex-row gap-1">
              <Button
                className="py-1 px-2 w-20"
                onClick={() => openFolder('/Documents/Articles')}
              >
                <div className="flex flex-col items-center gap-1 pt-1">
                  <img src={`${resources}/articles.png`} alt="" />
                  Articles
                </div>
              </Button>
              <Button
                className="py-1 px-2 w-20"
                onClick={() => openFolder('/Documents/Photos')}
              >
                <div className="flex flex-col items-center gap-1 pt-1">
                  <img src={`${resources}/photos.png`} alt="" />
                  Photos
                </div>
              </Button>
              <Button
                className="py-1 px-2 w-20"
                onClick={() => openFolder('/Documents/Projects')}
              >
                <div className="flex flex-col items-center gap-1 pt-1">
                  <img src={`${resources}/projects.png`} alt="" />
                  Projects
                </div>
              </Button>
            </div>

            <p className="font-display-text text-xl">
              You can take a look at the{' '}
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <button className="link" onClick={() => launch(help())}>
                help pages
              </button>{' '}
              to learn more about the different features of this site.
            </p>

            <p className="font-display-text text-xl mt-auto pt-8">
              Let's build awesome things together!{' '}
              <a href="mailto:teo.fum@outlook.com">Get in touch</a>
            </p>
          </div>

          <img src={`${resources}/me.png`} alt="me" className="self-end mt-6" />
        </div>
      </TabContent>

      <TabContent value="links" className="p-4 min-h-48">
        <ul className="flex flex-col gap-1.5">
          <li>
            <a
              href="https://github.com/teofum"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>{' '}
            — My GitHub profile
          </li>
          <li>
            <a
              href="https://lab.fumagalli.ar"
              target="_blank"
              rel="noopener noreferrer"
            >
              UI Lab
            </a>{' '}
            — Digital scratchpad where I test ideas for UI and React components.
            Expect rough POCs.
          </li>
          <li>
            <a
              href="https://codepen.io/teofum"
              target="_blank"
              rel="noopener noreferrer"
            >
              CodePen
            </a>{' '}
            — Quick demos, mostly written on the spot to share on a chat. Even
            rougher than the stuff in UI lab.
          </li>
        </ul>
      </TabContent>
    </Tabs>
  );
}
