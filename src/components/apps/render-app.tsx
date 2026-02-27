import About, { about } from './about';
import Intro, { intro } from './intro';
import Files, { files } from './files';
import type { FilesState } from './files/types';
import Preview, { preview } from './preview';
import type { PreviewState } from './preview/types';
import Help, { help } from './help';
import type { HelpState } from './help/types';
import Minesweeper, { minesweeper } from './minesweeper';
import MinesweeperCustomDifficulty, {
  mine_difficulty,
  type MinesweeperCustomDifficultyState,
} from './minesweeper/modals/custom-difficulty';
import Sudoku, { sudoku } from './sudoku';
import Solitaire, { solitaire } from './solitaire';
import SolitaireDeckSelect, {
  solitaire_deck,
} from './solitaire/modals/deck-select';
import ThemeSettings, { themeSettings } from './theme-settings';
import DOSEmu, { dosEmu } from './dos-emu';
import type { DOSEmuState } from './dos-emu/types';
import DitherLab, { ditherLab } from './dither-lab';
import type { DitherLabState } from './dither-lab/types';
import MessageBox, { messageBox } from './message-box';
import type { MessageBoxState } from './message-box/types';
import Paint, { paint } from './paint';
import PaintImageSize, {
  paint_imageSize,
  type PaintImageSizeState,
} from './paint/modals/image-size';
import PaintStretchAndSkew, {
  paint_stretchAndSkew,
  type PaintStretchAndSkewState,
} from './paint/modals/stretch-and-skew';
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
