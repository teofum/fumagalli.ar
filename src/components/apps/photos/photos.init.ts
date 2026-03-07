import type { WindowInit } from '@/components/desktop/Window';

import { defaultPhotosState } from './types';

export const photos: WindowInit<'photos'> = {
  appType: 'photos',
  appState: defaultPhotosState,

  title: 'Photos',
  icon: 'photos',

  minWidth: 720,
  width: 720,
  minHeight: 400,
  height: 480,
};
