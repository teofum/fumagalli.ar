import { WindowSizingMode, type WindowInit } from '~/components/desktop/Window';

export const sudoku: WindowInit = {
  appType: 'sudoku',

  title: 'Sudoku',

  sizingX: WindowSizingMode.AUTO,
  sizingY: WindowSizingMode.AUTO,

  maximizable: false,
};
