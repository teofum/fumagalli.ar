import { useDesktop } from '~/components/desktop/Desktop/context';
import Button from '~/components/ui/Button';
import { files } from '../Files';

export default function Intro() {
  const { launch } = useDesktop();

  const openFolder = (path: string) => {
    launch(files({ initialPath: path }));
  };

  return (
    <div className="bg-default bevel-content p-0.5 flex flex-row gap-2">
      <div className="flex flex-col flex-1 p-8 gap-2">
        <p className="font-text text-xl">Hi there! My name is</p>
        <h1 className="font-display text-4xl">
          <span className="tracking-[-3px]">T</span>eo{' '}
          <span className="tracking-[-2px]">F</span>umaga
          <span className="tracking-[-9px] -ml-1.5">lli</span>
        </h1>
        <p className="font-text text-xl">
          and I'm a web developer and designer based in Buenos Aires, Argentina.
          I make cool stuff for the web, and I'm passionate about exploring new
          possibilities and pushing the limits of what websites can do.
        </p>

        <p className="font-text text-xl">
          This is a very interactive site, so feel free to explore around, or
          check out some of my stuff:
        </p>

        <div className="flex flex-row gap-1">
          <Button
            className="py-1 px-2"
            onClick={() => openFolder('/Documents/Articles')}
          >
            Articles
          </Button>
          <Button
            className="py-1 px-2"
            onClick={() => openFolder('/Documents/Photos')}
          >
            Photos
          </Button>
          <Button
            className="py-1 px-2"
            onClick={() => openFolder('/Documents/Projects')}
          >
            Projects
          </Button>
        </div>

        <p className="font-text text-xl mt-auto">
          Want to work together?{' '}
          <a href="mailto:teo.fum@outlook.com">Get in touch</a>
        </p>
      </div>

      <img
        src="/fs/system/Applications/intro/resources/me.png"
        alt="me"
        className="self-end mt-6"
      />
    </div>
  );
}
