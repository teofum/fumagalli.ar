import { useEffect, useState } from 'react';
import cn from 'classnames';

import { useAppState } from '@/components/desktop/Window/context';
import Divider from '@/components/ui/Divider';
import ScrollContainer from '@/components/ui/ScrollContainer';
import useFetch from '@/hooks/use-fetch';
import type { PhotoCategory, PhotoCollectionBase } from '@/schemas/photos';

import Filters from './filters';

type PhotoCollectionProps = {
  collection: PhotoCollectionBase;
};

function PhotoCollection({ collection }: PhotoCollectionProps) {
  const [state, update] = useAppState('photos');

  const selected = collection.slug === state.collection;
  const select = () => update({ collection: collection.slug });

  const { load, data: count } = useFetch<number>();
  useEffect(() => {
    load(`/api/photos/${collection.slug}/count`);
  }, [load, collection.slug]);

  return (
    <li
      key={collection._id}
      className={cn('pl-2 p-1', { 'bevel-light-inset bg-checkered': selected })}
    >
      <button
        className="button bg-transparent w-full flex flex-row items-start relative z-1 group"
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
        <span className="self-center ml-auto text-light outline-none!">
          {count ?? '--'}
        </span>
      </button>
    </li>
  );
}

type PhotoCategoryProps = {
  category: PhotoCategory;
};

function PhotoCategory({ category }: PhotoCategoryProps) {
  const [state] = useAppState('photos');

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
          {category.collections.map((collection) => (
            <PhotoCollection key={collection.slug} collection={collection} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export default function CollectionsPanel() {
  const { load, data: categories } = useFetch<PhotoCategory[]>();
  const { load: loadCount, data: count } = useFetch<number>();

  useEffect(() => {
    load('/api/photo_categories');
    loadCount('/api/photos/count');
  }, [load, loadCount]);

  const [state, update] = useAppState('photos');
  const selected = state.collection === null;

  return (
    <div className="w-52 min-w-52 flex flex-col gap-0.5">
      <div className="bold px-2 select-none">Filters</div>
      <Filters />

      <div className="bold px-2 select-none">Catalog</div>
      <div
        className={cn('p-1', { 'bevel-light-inset bg-checkered': selected })}
      >
        <button
          className="button bg-transparent w-full flex flex-row items-start relative z-1 group"
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
          <span className="self-center ml-auto mr-1 text-light outline-none!">
            {count ?? '--'}
          </span>
        </button>
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
