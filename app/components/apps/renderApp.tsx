import About from './About';
import Intro from './Intro';
import Minesweeper from './Minesweeper';

export enum ApplicationType {
  ABOUT = 'about',
  INTRO = 'intro',
  MINESWEEPER = 'minesweeper',
}

interface AppOutletProps {
  type: ApplicationType;
}

export default function AppOutlet({ type }: AppOutletProps) {
  switch (type) {
    case ApplicationType.ABOUT:
      return <About />;
    case ApplicationType.INTRO:
      return <Intro />;
    case ApplicationType.MINESWEEPER:
      return <Minesweeper />;
    default:
      return <div>Unknown application {type}</div>;
  }
}
