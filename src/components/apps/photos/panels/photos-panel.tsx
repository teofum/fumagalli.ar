import { useEffect } from 'react';
import cn from 'classnames';

import { useAppState } from '@/components/desktop/Window/context';
import ScrollContainer from '@/components/ui/ScrollContainer';
import useFetch from '@/hooks/use-fetch';
import { Photo } from '@/schemas/photos';
import { sanityImage } from '@/utils/sanity.image';
import Button from '@/components/ui/Button';

import { PhotosSettings } from '../types';
import getPhotoDetails from '@/utils/photos/get-photo-details';
import { getLensDisplayName } from '@/utils/photos/get-lens-name';

type PhotoThumbnailProps = {
  photo: Photo;
  idx: number;
  size?: number;
  variant?: 'normal' | 'medium' | 'small';
};

function PhotoThumbnail({
  photo,
  idx,
  size = 128,
  variant = 'normal',
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

type PhotosViewProps = { photos: Photo[] };

function PhotosGridView({ photos }: PhotosViewProps) {
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

function PhotosLoupeView({ photos }: PhotosViewProps) {
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

function PhotosDetailsView({ photos }: PhotosViewProps) {
  return (
    <ScrollContainer className="grow min-w-0">
      <table className="p-1 select-none min-w-full">
        <thead className="sticky top-0 z-100">
          <tr>
            <th className="p-0">
              <div className="w-full h-4 px-2 bg-surface bevel" />
            </th>
            <th className="p-0">
              <Button className="w-full py-0 px-2 text-left">
                <span>Number</span>
              </Button>
            </th>
            <th className="p-0">
              <Button className="w-full py-0 px-2 text-left">
                <span>Filename</span>
              </Button>
            </th>
            <th className="p-0">
              <Button className="w-full py-0 px-2 text-left">
                <span>Date</span>
              </Button>
            </th>
            <th className="p-0">
              <Button className="w-full py-0 px-2 text-left">
                <span>Camera</span>
              </Button>
            </th>
            <th className="p-0">
              <Button className="w-full py-0 px-2 text-left">
                <span>Lens</span>
              </Button>
            </th>
            <th className="p-0">
              <Button className="w-full py-0 px-2 text-left">
                <span className="whitespace-nowrap">Focal length</span>
              </Button>
            </th>
            <th className="p-0">
              <Button className="w-full py-0 px-2 text-left">
                <span>Film</span>
              </Button>
            </th>
            <th className="p-0">
              <Button className="w-full py-0 px-2 text-left">
                <span>Aperture</span>
              </Button>
            </th>
            <th className="p-0">
              <Button className="w-full py-0 px-2 text-left">
                <span className="whitespace-nowrap">Shutter speed</span>
              </Button>
            </th>
            <th className="p-0">
              <Button className="w-full py-0 px-2 text-left">
                <span>ISO</span>
              </Button>
            </th>
            <th className="p-0">
              <Button className="w-full py-0 px-2 text-left">
                <span>Mode</span>
              </Button>
            </th>
          </tr>
        </thead>
        <tbody>
          {photos.map((photo, i) => {
            const {
              camera,
              lens,
              film,
              focalLength,
              date,
              aperture,
              shutterSpeed,
              iso,
            } = getPhotoDetails(photo);

            return (
              <tr key={photo._id}>
                <td className="min-w-8 w-8 max-w-8 p-0">
                  <PhotoThumbnail
                    photo={photo}
                    idx={i + 1}
                    size={32}
                    variant="small"
                  />
                </td>
                <td className="px-1 whitespace-nowrap">{i + 1}</td>
                <td className="px-1 whitespace-nowrap">
                  {photo.originalFilename}
                </td>
                <td className="px-1 whitespace-nowrap">{date}</td>
                <td className="px-1 whitespace-nowrap">{camera}</td>
                <td className="px-1 whitespace-nowrap">
                  {getLensDisplayName(lens)}
                </td>
                <td className="px-1 whitespace-nowrap">{focalLength}</td>
                <td className="px-1 whitespace-nowrap">{film}</td>
                <td className="px-1 whitespace-nowrap">{aperture}</td>
                <td className="px-1 whitespace-nowrap">{shutterSpeed}</td>
                <td className="px-1 whitespace-nowrap">{iso}</td>
                <td className="px-1 whitespace-nowrap capitalize">
                  {photo.metadata.exif.mode.replace('-', ' ')}
                </td>
                <td />
              </tr>
            );
          })}
        </tbody>
      </table>
    </ScrollContainer>
  );
}

type PhotosPanelProps = {
  viewMode: PhotosSettings['viewMode'];
};

export default function PhotosPanel({ viewMode }: PhotosPanelProps) {
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
    if (state.collection) load(`/api/photos/collection/${state.collection}`);
    else load('/api/photos');
  }, [load, state.collection]);

  if (!photos) return <div>No photos</div>;

  if (viewMode === 'grid') return <PhotosGridView photos={photos} />;
  if (viewMode === 'loupe') return <PhotosLoupeView photos={photos} />;
  return <PhotosDetailsView photos={photos} />;
}
