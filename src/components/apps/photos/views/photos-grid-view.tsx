import ScrollContainer from '@/components/ui/ScrollContainer';

import PhotoThumbnail from './photo-thumbnail';
import { PhotosViewProps } from './props';

export default function PhotosGridView({ photos, loupe }: PhotosViewProps) {
  return (
    <ScrollContainer hide="x" className="grow min-h-0">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(8rem,1fr))]">
        {photos?.map((photo, i) => (
          <PhotoThumbnail
            key={photo._id}
            photo={photo}
            idx={i + 1}
            onDoubleClick={loupe}
          />
        ))}
      </div>
    </ScrollContainer>
  );
}
