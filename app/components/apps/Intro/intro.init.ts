import { WindowSizingMode, type WindowInit } from '~/components/desktop/Window';

export const intro: WindowInit<'intro'> = {
  appType: 'intro',
  appState: undefined,

  title: 'About me',
  icon: 'man-with-hat',

  width: 640,

  sizingX: WindowSizingMode.FIXED,
  sizingY: WindowSizingMode.AUTO,

  maximizable: false,
};
