import type { WindowInit } from '~/components/desktop/Window';
import type { PreviewProps } from './Preview';

export const preview = (props?: PreviewProps): WindowInit => ({
  appType: 'preview',
  appProps: props,

  title: 'Preview',
  icon: 'preview',

  minWidth: 320,
});
