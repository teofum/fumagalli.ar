import { WindowSizingMode, type WindowInit } from '~/components/desktop/Window';

export const themeSettings: WindowInit<'theme'> = {
  appType: 'theme',
  appState: undefined,

  title: 'System Theme',

  sizingX: WindowSizingMode.AUTO,
  sizingY: WindowSizingMode.AUTO,

  maximizable: false,
};
