import { useEffect, useState } from 'react';

import { useAppState } from '@/components/desktop/Window/context';
import Divider from '@/components/ui/Divider';
import ScrollContainer from '@/components/ui/ScrollContainer';
import useFetch from '@/hooks/use-fetch';
import { type PhotoCategory } from '@/schemas/photos';

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
        className="button w-full flex flex-row gap-1 items-center"
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

export default function CollectionsPanel() {
  const { load, data: categories } = useFetch<PhotoCategory[]>();

  useEffect(() => {
    load('/api/photo_categories');
  }, [load]);

  const [state, update] = useAppState('photos');
  const selected = state.collection === null;

  return (
    <div className="w-52 flex flex-col gap-0.5">
      <div className="bevel-inset p-0.5">
        <div className="bevel bg-surface p-1">
          <button
            className="button w-full flex flex-row items-start relative z-1 group"
            onClick={() => update({ collection: null })}
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
              All photos
            </span>
          </button>
        </div>
      </div>

      <div className="bold px-2 select-none">Collections</div>
      <ScrollContainer hide="x" className="grow bg-surface">
        <ul className="flex flex-col">
          {categories?.map((category) => (
            <PhotoCategory key={category._id} category={category} />
          ))}
        </ul>
      </ScrollContainer>
    </div>
  );
}
