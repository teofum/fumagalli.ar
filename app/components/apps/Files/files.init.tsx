import type { WindowInit } from '~/components/desktop/Window';
import type { FilesProps } from './Files';

export const files = (props?: FilesProps): WindowInit => ({
  appType: 'files',
  appProps: props,

  title: 'File Explorer',
  icon: 'files',
});
