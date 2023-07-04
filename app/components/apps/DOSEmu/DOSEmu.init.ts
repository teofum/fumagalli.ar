import { type WindowInit } from '~/components/desktop/Window';
import { type DOSEmuState, defaultDOSEmuState } from './types';

export const dosEmu = (initialState?: DOSEmuState): WindowInit<'dos'> => ({
  appType: 'dos',
  appState: initialState ?? defaultDOSEmuState,

  title: 'DOSEmu',

  minWidth: 320,
  minHeight: 200,

  width: 640,
  height: 400,
});
