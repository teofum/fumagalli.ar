import type { WindowInit } from '~/components/desktop/Window';
import type { MarkdownFile } from '~/content/dir';

export const preview = (file?: MarkdownFile): WindowInit => ({
  appType: 'preview',
  appProps: { file },

  title: 'Document Viewer',
  icon: 'preview',

  minWidth: 320,
});
