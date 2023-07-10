import { type WindowInit } from '~/components/desktop/Window';
import { type DitherLabState, defaultDitherLabState } from './types';

export const ditherLab = (
  initialState?: DitherLabState,
): WindowInit<'dither'> => ({
  appType: 'dither',
  appState: initialState ?? defaultDitherLabState,

  title: 'DitherLab 2',

  width: 800,
  height: 640,
  minWidth: 800,
  minHeight: 400,
});
