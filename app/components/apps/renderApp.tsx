import About, { about } from './About';
import Intro, { intro } from './Intro';
import Files, { files } from './Files';
import Preview, { preview } from './Preview';
import Minesweeper, { minesweeper } from './Minesweeper';

const applications = [
  { Component: About, meta: about },
  { Component: Intro, meta: intro },
  { Component: Files, meta: files() },
  { Component: Preview, meta: preview() },
  { Component: Minesweeper, meta: minesweeper },
];

interface AppOutletProps {
  type: string;
  props?: unknown;
}

export default function AppOutlet({ type, props }: AppOutletProps) {
  const app = applications.find(({ meta }) => meta.appType === type);
  if (!app) return <div>Unknown application {type}</div>;

  const { Component } = app;
  return <Component {...(props as React.ComponentProps<typeof Component>)} />;
}
