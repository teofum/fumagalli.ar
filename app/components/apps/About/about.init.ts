import { WindowSizingMode, type WindowInit } from '~/components/desktop/Window';

export const about: WindowInit = {
  appType: 'about',

  title: 'About this website',
  icon: 'info',

  width: 400,

  sizingX: WindowSizingMode.FIXED,
  sizingY: WindowSizingMode.AUTO,

  maximizable: false,
};
