import { useMemo } from 'react';
import cn from 'classnames';

import { useAppState } from '~/components/desktop/Window/context';
import getPaletteColors from '~/dither/utils/paletteColors';

export default function PalettePreview() {
  const [state] = useAppState('dither');

  const colors = useMemo(
    () => getPaletteColors(state.palette),
    [state.palette],
  );

  return (
    <div className="flex flex-row flex-wrap">
      {colors.map(([r, g, b], i) => (
        <div
          key={i}
          className={cn('bevel-content', {
            'w-6 h-6': colors.length <= 32,
            'w-4 h-4': colors.length > 32 && colors.length <= 72,
            'w-3 h-3': colors.length > 72,
          })}
          style={{ backgroundColor: `rgb(${r} ${g} ${b})` }}
        />
      ))}
    </div>
  );
}
