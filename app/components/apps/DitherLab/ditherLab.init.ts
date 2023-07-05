import { type WindowInit } from '~/components/desktop/Window';

export const ditherLab: WindowInit<'dither'> = {
  appType: 'dither',
  appState: undefined,

  title: 'DitherLab',

  width: 640,
  height: 400,
  minWidth: 640,
  minHeight: 400,
};
