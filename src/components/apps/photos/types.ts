import { Photo } from '@/schemas/photos';

export type PhotosSettings = {
  leftPanel: boolean;
  rightPanel: boolean;

  sortBy: 'date' | 'filename';
  sort: 'asc' | 'desc';
  viewMode: 'grid' | 'details' | 'loupe';
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
  selected: Photo | null;
};

export const defaultPhotosState: PhotosState = {
  collection: null,
  filters: {},
  selected: null,
};
