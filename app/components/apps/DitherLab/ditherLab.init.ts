import { type WindowInit } from '~/components/desktop/Window';
import { type DitherLabState, defaultDitherLabState } from './types';

export const ditherLab = (
  initialState?: DitherLabState,
): WindowInit<'dither'> => ({
  appType: 'dither',
  appState: initialState ?? defaultDitherLabState,

  title: 'DitherLab',

  width: 640,
  height: 400,
  minWidth: 640,
  minHeight: 400,
});
