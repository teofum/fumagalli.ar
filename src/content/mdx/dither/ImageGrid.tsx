'use client';

import cn from 'classnames';
import { preview } from '@/components/apps/Preview';
import useDesktopStore from '@/stores/desktop';

function file(name: string) {
  return {
    class: 'file',
    type: 'image',
    name,
    size: 0,
    created: 0,
    modified: 0,
  } as const;
}

interface ImageGridProps {
  basePath: string;
  images: {
    src: string;
    formats: string[];
    alt: string;
    caption?: string;
  }[];
  size?: 'md' | 'lg';
}

export default function ImageGrid({
  basePath,
  images,
  size = 'md',
}: ImageGridProps) {
  const { launch } = useDesktopStore();

  const baseUrl = `/fs${basePath}`;

  return (
    <div
      className={cn(
        'bg-surface bevel p-2 font-sans text-base',
        'mx-auto my-4 grid gap-x-0.5 gap-y-1',
        {
          'grid-cols-[repeat(auto-fit,minmax(12rem,1fr))]': size === 'md',
          'grid-cols-[repeat(auto-fit,minmax(16rem,1fr))]': size === 'lg',
          'max-w-max': images.length === 1,
        },
      )}
    >
      {images.map((img) => {
        const fallback = `${img.src}.${img.formats.at(-1)}`;

        return (
          <figure
            key={img.src}
            // onClick={() =>
            //   launch(
            //     preview({
            //       file: file(fallback),
            //       filePath: `${basePath}${fallback}`,
            //     }),
            //   )
            // }
          >
            <div className="bevel-content p-0.5">
              <picture>
                {img.formats.map((format) => (
                  <source
                    key={format}
                    srcSet={`${baseUrl}${img.src}.${format}`}
                    type={`image/${format}`}
                  />
                ))}
                <img key="img" src={`${baseUrl}${fallback}`} alt={img.alt} />
              </picture>
            </div>
            {img.caption ? (
              <figcaption className="mt-0.5">{img.caption}</figcaption>
            ) : null}
          </figure>
        );
      })}
    </div>
  );
}
