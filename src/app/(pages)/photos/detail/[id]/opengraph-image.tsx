import { ImageResponse } from 'next/og';

import { PHOTO_QUERY } from '@/queries/queries';
import { Photo } from '@/schemas/photos';
import { sanityClient } from '@/utils/sanity.server';
import { sanityImage } from '@/utils/sanity.image';
import { ServerComponentProps } from '@/utils/types';

export const runtime = 'edge';

// Image metadata
export const alt = 'A photo';
export const size = {
  width: 1080,
  height: 720,
};

export const contentType = 'image/jpeg';

export default async function Image({ params }: ServerComponentProps) {
  const { id } = await params;

  const dmSerifDisplayData = await fetch(
    new URL(
      '../../../../../../public/font/dm-serif-display.ttf',
      import.meta.url,
    ),
  ).then((res) => res.arrayBuffer());

  const plexSansData = await fetch(
    new URL('../../../../../../public/font/plex-sans.ttf', import.meta.url),
  ).then((res) => res.arrayBuffer());

  const photo = (await sanityClient.fetch(PHOTO_QUERY(id as string))) as Photo;

  return new ImageResponse(
    (
      <div style={{ display: 'flex', position: 'relative' }}>
        <img
          style={{ aspectRatio: '3/2', objectFit: 'cover' }}
          alt={alt}
          src={sanityImage(photo._id)
            .width(size.width)
            .height(size.height)
            .quality(80)
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
            backgroundColor: 'rgb(0 0 0 / 0.6)',
            color: 'white',
          }}
        >
          <div
            style={{
              fontFamily: 'IBM Plex Sans',
              fontSize: 36,
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
