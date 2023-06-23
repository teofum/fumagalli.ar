import About from './About';
import Intro from './Intro';
import Files from './Files';
import Preview from './Preview';
import Minesweeper from './Minesweeper';

export enum ApplicationType {
  ABOUT = 'about',
  INTRO = 'intro',
  FILES = 'files',
  PREVIEW = 'preview',
  MINESWEEPER = 'minesweeper',
}

interface AppOutletProps {
  type: ApplicationType;
  props?: unknown;
}

export default function AppOutlet({ type, props }: AppOutletProps) {
  switch (type) {
    case ApplicationType.ABOUT:
      return <About />;
    case ApplicationType.INTRO:
      return <Intro />;
    case ApplicationType.FILES:
      return <Files {...(props as React.ComponentProps<typeof Files>)} />;
    case ApplicationType.PREVIEW:
      return <Preview {...(props as React.ComponentProps<typeof Preview>)} />;
    case ApplicationType.MINESWEEPER:
      return <Minesweeper />;
    default:
      return <div>Unknown application {type}</div>;
  }
}
