import type { WindowInit } from '@/components/desktop/Window';

export const photos: WindowInit<'photos'> = {
  appType: 'photos',
  appState: {},

  title: 'Photos',
  icon: 'photos',

  minWidth: 320,
  width: 720,
};
