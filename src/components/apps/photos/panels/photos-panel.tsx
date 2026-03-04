import { useEffect } from 'react';

import { useAppState } from '@/components/desktop/Window/context';
import ScrollContainer from '@/components/ui/ScrollContainer';
import useFetch from '@/hooks/use-fetch';
import { Photo } from '@/schemas/photos';
import { sanityImage } from '@/utils/sanity.image';

type PhotoThumbnailProps = {
  photo: Photo;
  idx: number;
  size?: number;
};

function PhotoThumbnail({ photo, idx, size = 128 }: PhotoThumbnailProps) {
  const aspect = photo.metadata.dimensions.aspectRatio;

  const width = Math.floor(size * Math.min(aspect, 1));
  const height = Math.floor(size / Math.max(aspect, 1));

  return (
    <div className="flex flex-col items-center gap-2 p-4 bevel-light bg-surface hover:bg-surface-light relative">
      <div className="absolute top-px left-px font-display text-2xl/6 text-surface-dark">
        {idx}
      </div>
      <div className="aspect-square w-full grid place-items-center min-h-0 relative">
        <div
          className="border border-black"
          style={{ width: `${100 * Math.min(aspect, 1)}%` }}
        >
          <div className="relative">
            <img
              className="absolute inset-0 w-full h-full object-cover [image-rendering:auto]"
              alt=""
              src={photo.metadata.lqip ?? undefined}
            />

            <img
              className="relative w-full object-cover [image-rendering:auto]"
              style={{ aspectRatio: width / height }}
              alt=""
              src={sanityImage(photo._id)
                .width(width)
                .height(height)
                .dpr(2)
                .quality(90)
                .url()}
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PhotosPanel() {
  const [state, update] = useAppState('photos');

  const { load, data: photos } = useFetch<Photo[]>();

  useEffect(() => {
    if (state.collection) load(`/api/photos/collection/${state.collection}`);
  }, [load, state.collection]);

  return (
    <ScrollContainer hide="x" className="grow">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(8rem,1fr))]">
        {photos?.map((photo, i) => (
          <PhotoThumbnail key={photo._id} photo={photo} idx={i + 1} />
        ))}
      </div>
    </ScrollContainer>
  );
}
