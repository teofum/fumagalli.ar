export type PhotosSettings = {
  leftPanel: boolean;
  rightPanel: boolean;

  sortBy: 'date' | 'filename';
  sort: 'asc' | 'desc';
  viewMode: 'grid' | 'loupe';
};

export const defaultPhotosSettings: PhotosSettings = {
  leftPanel: true,
  rightPanel: false,

  sortBy: 'date',
  sort: 'desc',
  viewMode: 'grid',
};

export type PhotosState = {
  collection: string | null;
  filters: { [key: string]: string[] };
};

export const defaultPhotosState: PhotosState = {
  collection: null,
  filters: {},
};
