import { WindowSizingMode, type WindowInit } from '~/components/desktop/Window';

export const minesweeper: WindowInit = {
  appType: 'minesweeper',

  title: 'Minesweeper',
  icon: 'mine',

  sizingX: WindowSizingMode.AUTO,
  sizingY: WindowSizingMode.AUTO,

  maximizable: false,
};
