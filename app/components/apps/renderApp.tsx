import About from './About';

export enum ApplicationType {
  ABOUT = 'about',
}

interface AppOutletProps {
  type: ApplicationType;
}

export default function AppOutlet({ type }: AppOutletProps) {
  switch (type) {
    case ApplicationType.ABOUT:
      return <About />;
    default:
      return <div>Unknown application {type}</div>;
  }
}
