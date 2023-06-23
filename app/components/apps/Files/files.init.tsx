import type { WindowInit } from '~/components/desktop/Window';
import { ApplicationType } from '../renderApp';
import type { FilesProps } from './Files';

export const files = (props?: FilesProps): WindowInit => ({
  appType: ApplicationType.FILES,
  appProps: props,

  title: 'File Explorer',
  icon: 'files',
});
