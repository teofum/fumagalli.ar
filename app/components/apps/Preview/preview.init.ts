import type { WindowInit } from '~/components/desktop/Window';
import { ApplicationType } from '../renderApp';

export const preview: WindowInit = {
  appType: ApplicationType.PREVIEW,

  title: 'Document Viewer',
  icon: 'info',
};
