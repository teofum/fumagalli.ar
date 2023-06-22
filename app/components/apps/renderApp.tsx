import About from './About';
import Intro from './Intro';

export enum ApplicationType {
  ABOUT = 'about',
  INTRO = 'intro',
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
    default:
      return <div>Unknown application {type}</div>;
  }
}
