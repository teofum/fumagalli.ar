import type { AnyFile } from '~/content/types';

export type FilesView = 'grid' | 'list' | 'details' | 'tree';

export interface FilesSettings {
  view: FilesView;
  statusBar: boolean;
  sideBar: 'none' | 'tree';
  buttons: 'large' | 'icon';
  toolbar: 'stacked' | 'compact';
}

export const defaultFilesSettings: FilesSettings = {
  view: 'grid',
  statusBar: true,
  sideBar: 'none',
  buttons: 'large',
  toolbar: 'stacked',
};

export interface FilesState {
  path: string;
  typeFilter?: AnyFile['type'][];
  modalCallback?: (file: AnyFile, path: string) => void;
}

export const defaultFilesState: FilesState = {
  path: '/',
};
