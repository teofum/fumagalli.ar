import type { WindowInit } from '@/components/desktop/Window';

import { defaultPhotosState } from './types';

export const photos: WindowInit<'photos'> = {
  appType: 'photos',
  appState: defaultPhotosState,

  title: 'Photos',
  icon: 'photos',

  minWidth: 320,
  width: 720,
};
