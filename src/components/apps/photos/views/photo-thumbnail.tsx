import cn from 'classnames';

import { useAppState } from '@/components/desktop/Window/context';
import { Photo } from '@/schemas/photos';
import { sanityImage } from '@/utils/sanity.image';

type PhotoThumbnailProps = {
  photo: Photo;
  idx: number;
  size?: number;
  variant?: 'normal' | 'medium' | 'small';
  onDoubleClick?: () => void;
};

export default function PhotoThumbnail({
  photo,
  idx,
  size = 128,
  variant = 'normal',
  onDoubleClick,
}: PhotoThumbnailProps) {
  const [state, update] = useAppState('photos');
  const selected = state.selected?._id === photo._id;
  const select = () => update({ selected: photo });

  const aspect = photo.metadata.dimensions.aspectRatio;

  const width = Math.floor(size * Math.min(aspect, 1));
  const height = Math.floor(size / Math.max(aspect, 1));

  return (
    <button
      className={cn('flex flex-col items-center gap-2 relative', {
        'bg-surface hover:bg-surface-light p-4': variant === 'normal',
        'bg-surface hover:bg-surface-light p-2': variant === 'medium',
        'bevel-light': variant !== 'small' && !selected,
        'bevel-light-inset bg-checkered': variant !== 'small' && selected,
        'p-0.5': variant === 'small',
      })}
      onClick={select}
      onDoubleClick={onDoubleClick}
    >
      {variant !== 'small' ? (
        <div className="absolute top-px left-px font-display text-2xl/6 text-surface-dark">
          {idx}
        </div>
      ) : null}
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
    </button>
  );
}
