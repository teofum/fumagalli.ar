import { useLoaderData, type V2_MetaFunction } from '@remix-run/react';
import { json, type LoaderArgs } from '@remix-run/node';

import { sanityClient } from '~/utils/sanity.server';
import { photoCollectionSchema } from '~/schemas/photos';
import { PHOTO_COLLECTION_QUERY } from '~/queries/queries';
import { getImageSize, sanityImage } from '~/utils/sanity.image';
import { useEffect, useMemo, useState } from 'react';
import cn from 'classnames';

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `${data?.title} photos — Teo Fumagalli` },
    { name: 'description', content: 'I shot some pictures :)' },
  ];
};

export async function loader({ params }: LoaderArgs) {
  const { slug } = params;

  if (!slug) throw new Error('TODO 404 handling');

  const data = await photoCollectionSchema
    .promise()
    .parse(sanityClient.fetch(PHOTO_COLLECTION_QUERY(slug)));

  return json(data);
}

export default function PhotosCategoryRoute() {
  const data = useLoaderData<typeof loader>();

  const [selected, setSelected] = useState<number | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [dpr, setDpr] = useState(1);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    setDpr(window.devicePixelRatio);

    const updateSize = () => {
      const maxWidth = Math.min(1280, window.innerWidth - 96);
      const maxHeight = window.innerHeight - 144;

      if (selected !== null) {
        let [naturalWidth, naturalHeight] = getImageSize(data.photos[selected ?? 0]);
        naturalWidth /= dpr;
        naturalHeight /= dpr;

        const scalingX = Math.min(1, maxWidth / naturalWidth);
        const scalingY = Math.min(1, maxHeight / naturalHeight);
        const scaling = Math.min(scalingX, scalingY);

        console.log(maxWidth, maxHeight);
        console.log(naturalWidth, naturalHeight);
        console.log(scalingX, scalingY);

        setWidth(Math.ceil(naturalWidth * scaling));
        setHeight(Math.ceil(naturalHeight * scaling));
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [selected]);

  // noinspection com.intellij.reactbuddy.ExhaustiveDepsInspection
  const selectedImageUrl = useMemo(
    () => selected !== null
      ? sanityImage(data.photos[selected].content)
        .width(Math.max(200, width)).dpr(dpr).quality(100).url()
      : '',
    [selected, width, data.photos, dpr],
  );

  const open = (idx: number) => {
    setSelected(idx);
    setShowOverlay(true);
  };

  const close = () => {
    setShowOverlay(false);
    setTimeout(() => setSelected(null), 200);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-title text-content-4xl sm:text-content-6xl mb-8">
        {data.title}
      </h1>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(12rem,1fr))] gap-3">
        {data.photos.map((photo, idx) => (
          <button key={photo._id}
                  className="block relative overflow-hidden group cursor-pointer"
                  onClick={() => open(idx)}>
            <img
              className="absolute inset-0 w-full h-full object-cover [image-rendering:auto]"
              alt=""
              src={photo.lqip}
            />

            <img
              className="relative w-full aspect-[3/2] group-hover:scale-[1.05] transition-transform duration-200 object-cover"
              alt=""
              src={sanityImage(photo.content).width(396).dpr(dpr).quality(100).url()} // Thumbnails are at most 396px wide
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {selected !== null ? <div
        className={cn('fixed inset-0  bg-default/20 pixelate-bg p-12', {
          'animate-overlay-fadein': showOverlay,
          'animate-overlay-fadeout pointer-events-none': !showOverlay,
        })}
        onClick={close}>
        <div className="max-w-7xl mx-auto w-max h-full grid grid-cols-1 place-content-center">
          <div className="relative bg-black overflow-hidden"
               style={{ width, height }}>
            <img
              className="absolute inset-0 w-full h-full object-cover blur-3xl"
              alt=""
              src={data.photos[selected].lqip}
            />

            <img
              className="absolute inset-0 w-full h-full"
              alt=""
              src={selectedImageUrl}
              loading="lazy"
            />
          </div>
          <div className="flex flex-row items-center h-12 min-h-12 pt-3 gap-6">
            <button className="text-start hover:underline"
                    onClick={close}>
              Close
            </button>

            <a className="cursor-pointer hover:underline"
               href={sanityImage(data.photos[selected].content, false).quality(100).format('jpg').url()}
               onClick={(e) => e.stopPropagation()}>
              Full size
            </a>
          </div>
        </div>
      </div> : null}
    </div>
  );
}