import type { WindowInit } from '~/components/desktop/Window';
import { type HelpState, defaultHelpState } from './types';

export const help = (initialState?: HelpState): WindowInit<'help'> => ({
  appType: 'help',
  appState: initialState ?? defaultHelpState,

  title: 'Help',

  minWidth: 600,
  minHeight: 400,

  width: 600,
  height: 400,
});
