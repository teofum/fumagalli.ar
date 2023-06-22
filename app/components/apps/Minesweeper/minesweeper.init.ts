import { WindowSizingMode, type WindowInit } from '~/components/desktop/Window';
import { ApplicationType } from '../renderApp';

export const minesweeper: WindowInit = {
  appType: ApplicationType.MINESWEEPER,

  title: 'Minesweeper',
  icon: 'mine',

  sizingX: WindowSizingMode.AUTO,
  sizingY: WindowSizingMode.AUTO,

  maximizable: false,
};
