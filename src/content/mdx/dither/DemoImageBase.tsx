'use client';

import cn from 'classnames';
import {
  PaletteType,
  type Palette,
  PaletteGroup,
} from '@/dither/palettes/types';

export const NULL_PALETTE: Palette = {
  name: '',
  type: PaletteType.Indexed,
  group: PaletteGroup.Hidden,
  data: [],
};

interface DemoImageBaseProps {
  canvasRef: React.Ref<HTMLCanvasElement>;
  imgRef: React.Ref<HTMLImageElement>;
  hideCanvas?: boolean;
  imageUrl?: string;
  children: React.ReactNode;
}

export default function DemoImageBase({
  canvasRef,
  imgRef,
  hideCanvas,
  imageUrl = '/fs/Documents/Articles/assets/dither/tram-original',
  children,
}: DemoImageBaseProps) {
  return (
    <div className="demo">
      <div className="bevel-content p-0.5">
        <div className="relative">
          <picture className="block w-80">
            <source srcSet={`${imageUrl}.webp`} type="image/webp" />
            <source srcSet={`${imageUrl}.jpeg`} type="image/jpeg" />
            <img src={`${imageUrl}.jpeg`} alt="Original" ref={imgRef} />
          </picture>
          <canvas
            className={cn('absolute inset-0 w-full h-full', {
              'opacity-0': hideCanvas,
            })}
            ref={canvasRef}
          />
        </div>
      </div>

      <div className="demo-controls">{children}</div>
    </div>
  );
}
