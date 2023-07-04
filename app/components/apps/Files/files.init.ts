import type { WindowInit } from '~/components/desktop/Window';
import { type FilesState, defaultFilesState } from './types';

export const files = (initialState?: FilesState): WindowInit<'files'> => ({
  appType: 'files',
  appState: initialState ?? defaultFilesState,

  title: 'File Explorer',
  icon: 'files',

  minWidth: 400,
  minHeight: 300,
});
