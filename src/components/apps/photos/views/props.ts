import { Photo } from '@/schemas/photos';

export type PhotosViewProps = {
  photos: Photo[];
  loupe?: () => void;
};
