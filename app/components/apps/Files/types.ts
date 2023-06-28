export type FilesView = 'grid' | 'list' | 'details';

export interface FilesSettings {
  view: FilesView;
  statusBar: boolean;
}

export const defaultFilesSettings: FilesSettings = {
  view: 'grid',
  statusBar: true,
};
