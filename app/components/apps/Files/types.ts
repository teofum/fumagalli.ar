import type { AnyFile } from '~/schemas/file';
import type { ItemStub } from '~/schemas/folder';

export type FilesView = 'grid' | 'list' | 'details' | 'tree' | 'columns';

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
  folderId: string;
  history: string[];
  backCount: number;

  typeFilter?: AnyFile['_type'][];
  modalCallback?: (file: ItemStub) => void;
}

export const defaultFilesState: FilesState = {
  folderId: 'root',
  history: [],
  backCount: 0,
};
