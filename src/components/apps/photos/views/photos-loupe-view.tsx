import { RefObject } from 'react';

import { useAppState } from '@/components/desktop/Window/context';
import ScrollContainer from '@/components/ui/ScrollContainer';
import { sanityImage, useImageSize2 } from '@/utils/sanity.image';

import PhotoThumbnail from './photo-thumbnail';
import { PhotosViewProps } from './props';
import { PhotosSettings } from '../types';

type LoupeViewProps = PhotosViewProps & {
  viewportRef: RefObject<HTMLDivElement | null>;
  imageRef: RefObject<HTMLImageElement | null>;
  viewMode: PhotosSettings['viewMode'];
};

export default function PhotosLoupeView({
  photos,
  viewportRef,
  imageRef,
  filmStrip,
}: LoupeViewProps) {
  const [state] = useAppState('photos');
  const [width, height] = useImageSize2(
    state.selected?.metadata.dimensions ?? {
      width: 0,
      height: 0,
      aspectRatio: 0,
    },
  );

  const zoom = state.zoom ?? 1;

  return (
    <div className="grow flex flex-col min-w-0 min-h-0 gap-0.5">
      <ScrollContainer className="grow" ref={viewportRef}>
        {state.selected ? (
          // funny hack to force react to rerender this component when selection changes
          [state.selected].map((photo) => (
            <div key={photo._id} className="scroll-center">
              <div className="flex w-min border border-default bg-surface-light bg-checkered-lg select-none relative">
                <img
                  className="absolute inset-0 w-full h-full object-cover [image-rendering:auto]"
                  alt=""
                  src={photo.metadata.lqip ?? undefined}
                />

                <img
                  className="relative w-full object-cover [image-rendering:auto]"
                  style={{
                    width: width * zoom,
                    minWidth: width * zoom,
                    height: height * zoom,
                    minHeight: height * zoom,
                  }}
                  alt=""
                  ref={imageRef}
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
          ))
        ) : (
          <div>No photo selected</div>
        )}
      </ScrollContainer>

      {filmStrip ? (
        <ScrollContainer hide="y" className="shrink-0">
          <div className="flex flex-row">
            {photos?.map((photo, i) => (
              <div className="w-20 h-20" key={photo._id}>
                <PhotoThumbnail
                  photo={photo}
                  idx={i + 1}
                  size={80}
                  variant="medium"
                />
              </div>
            ))}
          </div>
        </ScrollContainer>
      ) : null}
    </div>
  );
}
