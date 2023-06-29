export type FilesView = 'grid' | 'list' | 'details' | 'tree';

export interface FilesSettings {
  view: FilesView;
  statusBar: boolean;
  sideBar: 'none' | 'tree';
}

export const defaultFilesSettings: FilesSettings = {
  view: 'grid',
  statusBar: true,
  sideBar: 'none',
};

export interface FilesState {
  path: string;
}

export const defaultFilesState: FilesState = {
  path: '/',
};
