'use client';

import type { Palette } from '@/dither/palettes/types';
import getPaletteColors from '@/dither/utils/paletteColors';

type PaletteSwatchesProps = {
  palette: Palette;
};

export default function PaletteSwatches({ palette }: PaletteSwatchesProps) {
  const colors = getPaletteColors(palette);

  return (
    <div className="p-2 bg-surface bevel my-4 mx-auto w-fit">
      <div className="flex flex-row flex-wrap w-64">
        {colors.map(([r, g, b], i) => (
          <div
            key={i}
            className="bevel-content w-8 h-8"
            style={{ backgroundColor: `rgb(${r} ${g} ${b})` }}
          />
        ))}
      </div>
    </div>
  );
}
