import { useEffect, useState } from 'react';

import useFetch from '@/hooks/use-fetch';
import { Photo, type PhotoCategory } from '@/schemas/photos';
import { useAppState } from '@/components/desktop/Window/context';
import Divider from '@/components/ui/Divider';
import ScrollContainer from '@/components/ui/ScrollContainer';
import { sanityImage } from '@/utils/sanity.image';

type PhotoCategoryProps = {
  category: PhotoCategory;
};

function PhotoCategory({ category }: PhotoCategoryProps) {
  const [state, update] = useAppState('photos');

  const [expanded, setExpanded] = useState(
    category.collections.some((c) => c.slug === state.collection),
  );

  return (
    <li className="bevel bg-surface p-1">
      <button
        className="button w-full flex flex-row gap-1 items-center py-0.75"
        onClick={() => setExpanded(!expanded)}
      >
        <img
          className="w-4 h-4"
          src={`/assets/icons/directory_${expanded ? 'open' : 'closed'}.png`}
          alt=""
        />

        {category.title}
      </button>

      {expanded ? (
        <ul>
          <Divider className="my-1" />
          {category.collections.map((collection) => {
            const selected = collection.slug === state.collection;
            const select = () => update({ collection: collection.slug });

            return (
              <li key={collection._id} className="pl-2 py-0.5">
                <button
                  className="button w-full flex flex-row items-start relative z-1 group"
                  onClick={select}
                >
                  <span className="relative min-w-4 outline-none!">
                    <img
                      className="w-4 h-4"
                      src={`/assets/icons/directory_${selected ? 'open' : 'closed'}.png`}
                      alt=""
                    />
                    <span
                      className="absolute inset-0 bg-selection/50 hidden group-focus:inline"
                      style={{
                        WebkitMaskImage: `url('/assets/icons/directory_${selected ? 'open' : 'closed'}.png')`,
                      }}
                    />
                  </span>
                  <span className="self-center ml-1 group-focus:bg-selection group-focus:text-selection">
                    {collection.title}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </li>
  );
}

function CategoriesPanel() {
  const { load, data: categories } = useFetch<PhotoCategory[]>();

  useEffect(() => {
    load('/api/photo_categories');
  }, [load]);

  return (
    <ScrollContainer hide="x" className="w-52 bg-surface">
      <ul className="flex flex-col">
        {categories?.map((category) => (
          <PhotoCategory key={category._id} category={category} />
        ))}
      </ul>
    </ScrollContainer>
  );
}

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

function PhotosPanel() {
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

export default function Photos() {
  return (
    <div className="flex flex-row items-stretch gap-0.5 min-h-0">
      <CategoriesPanel />
      <PhotosPanel />
      <div className="bevel-inset p-0.5">
        <div className="bevel bg-surface p-1">hello</div>
      </div>
    </div>
  );
}
