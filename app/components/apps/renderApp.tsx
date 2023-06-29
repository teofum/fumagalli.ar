import About, { about } from './About';
import Intro, { intro } from './Intro';
import Files, { files } from './Files';
import type { FilesState } from './Files/types';
import Preview, { preview } from './Preview';
import type { PreviewState } from './Preview/types';
import Minesweeper, { minesweeper } from './Minesweeper';
import Sudoku, { sudoku } from './Sudoku';
import Solitaire, { solitaire } from './Solitaire';
import ThemeSettings, { themeSettings } from './ThemeSettings';

const applications = [
  { Component: About, meta: about },
  { Component: Intro, meta: intro },
  { Component: Files, meta: files() },
  { Component: Preview, meta: preview() },
  { Component: Minesweeper, meta: minesweeper },
  { Component: Solitaire, meta: solitaire },
  { Component: Sudoku, meta: sudoku },
  { Component: ThemeSettings, meta: themeSettings },
];

interface AppStateTypes {
  files: FilesState;
  preview: PreviewState;
}

export type AppState<AppType extends string> =
  AppType extends keyof AppStateTypes ? AppStateTypes[AppType] : undefined;

interface AppOutletProps {
  type: string;
}

export default function AppOutlet({ type }: AppOutletProps) {
  const app = applications.find(({ meta }) => meta.appType === type);
  if (!app) return <div>Unknown application {type}</div>;

  const { Component } = app;
  return <Component />;
}

export function getApp(type: string) {
  const app = applications.find(({ meta }) => meta.appType === type);
  if (!app) return null;

  return app.meta;
}
