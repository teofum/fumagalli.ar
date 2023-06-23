import type { WindowInit } from '~/components/desktop/Window';
import { ApplicationType } from '../renderApp';
import type { MarkdownFile } from '~/content/dir';

export const preview = (file?: MarkdownFile): WindowInit => ({
  appType: ApplicationType.PREVIEW,
  appProps: { file },

  title: 'Document Viewer',
  icon: 'preview',
});
