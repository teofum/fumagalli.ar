import type { WindowInit } from '@/components/desktop/Window';
import { type FilesState, defaultFilesState } from './types';

export const files = (
  initialState?: Partial<FilesState>,
): WindowInit<'files'> => ({
  appType: 'files',
  appState: {
    ...defaultFilesState,
    ...initialState,
    history: [initialState?.folderId ?? defaultFilesState.folderId],
  },

  title: 'File Explorer',

  minWidth: 400,
  minHeight: 300,
});
