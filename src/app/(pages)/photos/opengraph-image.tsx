import { ImageResponse } from 'next/og';
import z from 'zod';

import { PHOTO_BY_IDX_QUERY, PHOTO_COUNT_QUERY } from '@/queries/queries';
import { photoSchema } from '@/schemas/photos';
import { sanityClient } from '@/utils/sanity.server';
import { sanityImage } from '@/utils/sanity.image';

export const runtime = 'edge';

// Image metadata
export const alt = 'Photo of the day';
export const size = {
  width: 1080,
  height: 720,
};

export const contentType = 'image/jpeg';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export default async function Image() {
  const dmSerifDisplayData = await fetch(
    new URL('../../../../public/font/dm-serif-display.ttf', import.meta.url),
  ).then((res) => res.arrayBuffer());

  const plexSansData = await fetch(
    new URL('../../../../public/font/plex-sans.ttf', import.meta.url),
  ).then((res) => res.arrayBuffer());

  const today = Math.floor(new Date().getTime() / MS_PER_DAY);
  const hash = today ^ (0x9e3779b9 + (today << 6) + (today >> 2));

  const count = z.number().parse(await sanityClient.fetch(PHOTO_COUNT_QUERY));
  const photoOfTheDay = photoSchema.parse(
    await sanityClient.fetch(PHOTO_BY_IDX_QUERY(hash % count)),
  );

  return new ImageResponse(
    (
      <div style={{ display: 'flex', position: 'relative' }}>
        <img
          style={{ aspectRatio: '3/2', objectFit: 'cover' }}
          alt={alt}
          src={sanityImage(photoOfTheDay._id)
            .width(size.width)
            .height(size.height)
            .quality(70)
            .url()}
        />

        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            paddingBottom: 16,
            paddingTop: 24,
            paddingLeft: 24,
            paddingRight: 24,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            backgroundColor: 'black',
            color: 'white',
          }}
        >
          <div
            style={{
              fontFamily: 'IBM Plex Sans',
              fontSize: 24,
              marginBottom: -6,
            }}
          >
            Teo Fumagalli
          </div>
          <div style={{ fontFamily: 'DM Serif Display', fontSize: 72 }}>
            Photography
          </div>
        </div>
      </div>
    ),
    {
      width: size.width,
      height: size.height,
      fonts: [
        { name: 'DM Serif Display', data: dmSerifDisplayData, style: 'normal' },
        { name: 'IBM Plex Sans', data: plexSansData, style: 'normal' },
      ],
    },
  );
}
