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
  filmStrip: PhotosSettings['filmStrip'];
  loupe?: () => void;
  viewportRef: RefObject<HTMLDivElement | null>;
  imageRef: RefObject<HTMLImageElement | null>;
};

export default function PhotosPanel({
  viewMode,
  filmStrip,
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
    const query = Object.entries(state.filters)
      .map(([tag, values]) =>
        values.map((value) => `${tag}=${value}`).join('&'),
      )
      .join('&');

    if (state.collection) {
      load(`/api/photos/${state.collection}?${query}`);
    } else {
      load(`/api/photos?${query}`);
    }
  }, [load, state.collection, state.filters]);

  if (!photos) return <div>No photos</div>;

  if (viewMode === 'grid')
    return <PhotosGridView photos={photos} loupe={loupe} />;
  if (viewMode === 'loupe')
    return (
      <PhotosLoupeView
        photos={photos}
        viewportRef={viewportRef}
        imageRef={imageRef}
        filmStrip={filmStrip}
      />
    );
  return <PhotosDetailsView photos={photos} loupe={loupe} />;
}
