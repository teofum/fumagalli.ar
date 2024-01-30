import { WindowSizingMode, type WindowInit } from '~/components/desktop/Window';

export const systemSettings: WindowInit<'settings'> = {
  appType: 'settings',
  appState: undefined,

  title: 'System Settings',

  sizingX: WindowSizingMode.AUTO,
  sizingY: WindowSizingMode.AUTO,

  maximizable: false,
};
