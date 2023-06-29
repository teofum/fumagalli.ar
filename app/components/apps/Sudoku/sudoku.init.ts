import { WindowSizingMode, type WindowInit } from '~/components/desktop/Window';

export const sudoku: WindowInit<'sudoku'> = {
  appType: 'sudoku',
  appState: undefined,

  title: 'Sudoku',

  sizingX: WindowSizingMode.AUTO,
  sizingY: WindowSizingMode.AUTO,

  maximizable: false,
};
