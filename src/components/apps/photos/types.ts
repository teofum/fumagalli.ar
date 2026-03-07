import { Photo } from '@/schemas/photos';

export type PhotosSettings = {
  leftPanel: boolean;
  rightPanel: boolean;
  buttons: 'large' | 'icon';

  sortBy: 'date' | 'filename';
  sort: 'asc' | 'desc';
  viewMode: 'grid' | 'details' | 'loupe';
};

export const defaultPhotosSettings: PhotosSettings = {
  leftPanel: true,
  rightPanel: false,
  buttons: 'large',

  sortBy: 'date',
  sort: 'desc',
  viewMode: 'grid',
};

export type PhotosState = {
  collection: string | null;
  filters: { [key: string]: string[] };
  selected: Photo | null;

  zoom: number | null;
};

export const defaultPhotosState: PhotosState = {
  collection: null,
  filters: {},
  selected: null,

  zoom: null,
};
