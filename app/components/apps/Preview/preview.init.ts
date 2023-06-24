import type { WindowInit } from '~/components/desktop/Window';
import type { PreviewSupportedFile } from './context';

export const preview = (file?: PreviewSupportedFile): WindowInit => ({
  appType: 'preview',
  appProps: { file },

  title: 'Preview',
  icon: 'preview',

  minWidth: 320,
});
