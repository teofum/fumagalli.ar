import About, { about } from './the-about';
import Intro, { intro } from './Intro';
import Files, { files } from './Files';
import type { FilesState } from './Files/types';
import Preview, { preview } from './the-preview';
import type { PreviewState } from './the-preview/types';
import Help, { help } from './the-help';
import type { HelpState } from './the-help/types';
import Minesweeper, { minesweeper } from './Minesweeper';
import MinesweeperCustomDifficulty, {
  mine_difficulty,
} from './Minesweeper/modals/custom-difficulty';
import type { MinesweeperCustomDifficultyState } from './Minesweeper/modals/custom-difficulty';
import Sudoku, { sudoku } from './the-sudoku';
import Solitaire, { solitaire } from './the-solitaire';
import SolitaireDeckSelect, {
  solitaire_deck,
} from './the-solitaire/modals/deck-select';
import ThemeSettings, { themeSettings } from './theme-settings';
import DOSEmu, { dosEmu } from './DOSEmu';
import type { DOSEmuState } from './DOSEmu/types';
import DitherLab, { ditherLab } from './dither-lab';
import type { DitherLabState } from './dither-lab/types';
import MessageBox, { messageBox } from './MessageBox';
import type { MessageBoxState } from './MessageBox/types';
import Paint, { paint } from './Paint';
import PaintImageSize, { paint_imageSize } from './Paint/modals/ImageSize';
import type { PaintImageSizeState } from './Paint/modals/ImageSize';
import PaintStretchAndSkew, {
  paint_stretchAndSkew,
} from './Paint/modals/StretchAndSkew';
import type { PaintStretchAndSkewState } from './Paint/modals/StretchAndSkew';
import SystemSettings, { systemSettings } from './system-settings';

export const applications = [
  { Component: About, meta: about },
  { Component: Intro, meta: intro },
  { Component: Files, meta: files() },
  { Component: Preview, meta: preview() },
  { Component: Help, meta: help() },
  { Component: Minesweeper, meta: minesweeper },
  { Component: MinesweeperCustomDifficulty, meta: mine_difficulty() },
  { Component: Solitaire, meta: solitaire },
  { Component: SolitaireDeckSelect, meta: solitaire_deck },
  { Component: Sudoku, meta: sudoku },
  { Component: ThemeSettings, meta: themeSettings },
  { Component: SystemSettings, meta: systemSettings },
  { Component: DOSEmu, meta: dosEmu() },
  { Component: DitherLab, meta: ditherLab() },
  { Component: Paint, meta: paint },
  { Component: PaintImageSize, meta: paint_imageSize() },
  { Component: PaintStretchAndSkew, meta: paint_stretchAndSkew() },
  { Component: MessageBox, meta: messageBox() },
];

export interface AppStateTypes {
  files: FilesState;
  preview: PreviewState;
  help: HelpState;
  dos: DOSEmuState;
  dither: DitherLabState;
  messageBox: MessageBoxState;
  mine_difficulty: MinesweeperCustomDifficultyState;
  paint_imageSize: PaintImageSizeState;
  paint_stretchAndSkew: PaintStretchAndSkewState;
}

export type AppState<AppType extends string> =
  AppType extends keyof AppStateTypes ? AppStateTypes[AppType] : unknown;

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
