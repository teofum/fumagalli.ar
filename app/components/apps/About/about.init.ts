import { WindowSizingMode, type WindowInit } from '~/components/desktop/Window';

export const about: WindowInit<'about'> = {
  appType: 'about',
  appState: undefined,

  title: 'About this website',
  icon: 'info',

  width: 400,
  height: 200,

  sizingX: WindowSizingMode.FIXED,
  sizingY: WindowSizingMode.AUTO,

  maximizable: false,
};
