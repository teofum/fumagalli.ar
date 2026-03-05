import { useAppState } from '@/components/desktop/Window/context';
import ScrollContainer from '@/components/ui/ScrollContainer';
import { sanityImage } from '@/utils/sanity.image';

import PhotoThumbnail from './photo-thumbnail';
import { PhotosViewProps } from './props';

export default function PhotosLoupeView({ photos }: PhotosViewProps) {
  const [state] = useAppState('photos');

  return (
    <div className="grow flex flex-col min-w-0 gap-0.5">
      <ScrollContainer className="grow">
        {state.selected ? (
          // funny hack to force react to rerender this component when selection changes
          [state.selected].map((photo) => (
            <div key={photo._id}>
              <div className="relative">
                <img
                  className="absolute inset-0 w-full h-full object-cover [image-rendering:auto]"
                  alt=""
                  src={photo.metadata.lqip ?? undefined}
                />

                <img
                  className="relative w-full object-cover [image-rendering:auto]"
                  style={{
                    aspectRatio: photo.metadata.dimensions.aspectRatio,
                  }}
                  alt=""
                  src={sanityImage(photo._id)
                    .width(photo.metadata.dimensions.width)
                    .height(photo.metadata.dimensions.height)
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
    </div>
  );
}
