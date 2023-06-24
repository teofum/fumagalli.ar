import { WindowSizingMode, type WindowInit } from '~/components/desktop/Window';

export const about: WindowInit = {
  appType: 'about',

  title: 'About this website',
  icon: 'info',

  top: 100,
  left: 100,
  width: 400,

  sizingX: WindowSizingMode.FIXED,
  sizingY: WindowSizingMode.AUTO,

  maximizable: false,
};
