import useDesktopStore from '~/stores/desktop';
import Button from '~/components/ui/Button';
import { Tab, TabContent, Tabs, TabsList } from '~/components/ui/Tabs';
import { files } from '../Files';
import RetroLink from '~/components/ui/Link';

const resources = '/fs/Applications/intro/resources';

export default function Intro() {
  const { launch } = useDesktopStore();

  const openFolder = (folderId: string) => {
    launch(files({ folderId }));
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
              and I'm a UI developer based in Buenos Aires, Argentina. I build
              things for the web, combining design and technical skill to bring
              products to life.
            </p>

            <p className="font-display-text text-xl">
              I specialize in creating things out of the ordinary, with a focus
              on interaction and intricate attention to detail. I believe the
              web can be both useful and fun, and enjoy exploring new and
              unusual ideas.
            </p>

            <p className="font-display-text text-xl">
              I'm currently working as a UI developer at Aerolab, building
              quality websites and apps for a variety of clients.
            </p>

            <p className="font-display-text text-xl">
              This is a very interactive site, so feel free to explore around,
              or check out some of my stuff:
            </p>

            <div className="flex flex-row gap-1">
              <Button
                className="py-1 px-2 w-20"
                onClick={() =>
                  openFolder('679b7214-24c9-439e-86bc-cd86cc215dc3')
                }
              >
                <div className="flex flex-col items-center gap-1 pt-1">
                  <img src={`${resources}/articles.png`} alt="" />
                  Articles
                </div>
              </Button>
              <Button
                className="py-1 px-2 w-20"
                onClick={() =>
                  openFolder('49fba51f-c8ee-450d-bc21-522066ceb7ea')
                }
              >
                <div className="flex flex-col items-center gap-1 pt-1">
                  <img src={`${resources}/photos.png`} alt="" />
                  Photos
                </div>
              </Button>
              <Button
                className="py-1 px-2 w-20"
                onClick={() =>
                  openFolder('2d282fb9-580f-47c1-a419-1db426c6a2c9')
                }
              >
                <div className="flex flex-col items-center gap-1 pt-1">
                  <img src={`${resources}/projects.png`} alt="" />
                  Work
                </div>
              </Button>
            </div>

            <p className="font-display-text text-xl mt-auto pt-8">
              Let's build awesome things together!{' '}
              <RetroLink href="mailto:teo.fum@outlook.com">
                Get in touch
              </RetroLink>
            </p>
          </div>

          <img src={`${resources}/me.png`} alt="me" className="self-end mt-6" />
        </div>
      </TabContent>

      <TabContent value="links" className="p-4 min-h-48">
        <ul className="flex flex-col gap-1.5">
          <li>
            <RetroLink
              href="https://github.com/teofum"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </RetroLink>{' '}
            — My GitHub profile
          </li>
          <li>
            <RetroLink
              href="https://lab.fumagalli.ar"
              target="_blank"
              rel="noopener noreferrer"
            >
              UI Lab
            </RetroLink>{' '}
            — Digital scratchpad where I test ideas for UI and React components.
            Expect rough POCs.
          </li>
          <li>
            <RetroLink
              href="https://codepen.io/teofum"
              target="_blank"
              rel="noopener noreferrer"
            >
              CodePen
            </RetroLink>{' '}
            — Quick demos, mostly written on the spot to share on a chat. Even
            rougher than the stuff in UI lab.
          </li>
        </ul>
      </TabContent>
    </Tabs>
  );
}
