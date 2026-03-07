import { RefObject, useEffect } from 'react';

import { useAppState } from '@/components/desktop/Window/context';
import useFetch from '@/hooks/use-fetch';
import { Photo } from '@/schemas/photos';

import { PhotosSettings } from '../types';
import PhotosDetailsView from '../views/photos-details-view';
import PhotosGridView from '../views/photos-grid-view';
import PhotosLoupeView from '../views/photos-loupe-view';

type PhotosPanelProps = {
  viewMode: PhotosSettings['viewMode'];
  loupe?: () => void;
  viewportRef: RefObject<HTMLDivElement | null>;
  imageRef: RefObject<HTMLImageElement | null>;
};

export default function PhotosPanel({
  viewMode,
  loupe,
  viewportRef,
  imageRef,
}: PhotosPanelProps) {
  const [state] = useAppState('photos');

  const { load, data } = useFetch<Photo[]>();
  const photos = data?.map((p) => ({
    ...p,
    metadata: {
      ...p.metadata,
      exif: {
        ...p.metadata.exif,
        dateTime: p.metadata.exif.dateTime
          ? new Date(p.metadata.exif.dateTime)
          : undefined,
      },
    },
  }));

  useEffect(() => {
    if (state.collection) load(`/api/photos/${state.collection}`);
    else load('/api/photos');
  }, [load, state.collection]);

  if (!photos) return <div>No photos</div>;

  if (viewMode === 'grid')
    return <PhotosGridView photos={photos} loupe={loupe} />;
  if (viewMode === 'loupe')
    return (
      <PhotosLoupeView
        photos={photos}
        viewportRef={viewportRef}
        imageRef={imageRef}
      />
    );
  return <PhotosDetailsView photos={photos} loupe={loupe} />;
}
