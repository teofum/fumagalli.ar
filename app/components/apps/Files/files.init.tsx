import type { WindowInit } from '~/components/desktop/Window';
import { ApplicationType } from '../renderApp';

export const files: WindowInit = {
  appType: ApplicationType.FILES,

  title: 'File Explorer',
  icon: 'info',
};
