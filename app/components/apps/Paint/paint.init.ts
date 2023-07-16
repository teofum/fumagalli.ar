import type { WindowInit } from '~/components/desktop/Window';
import { defaultPaintState, type PaintState } from './types';

export const paint = (initialState?: PaintState): WindowInit<'paint'> => ({
  appType: 'paint',
  appState: initialState ?? defaultPaintState,

  title: 'Paint',

  minWidth: 300,
  minHeight: 400,

  width: 600,
  height: 480,
});
