import { useMemo } from 'react';

import { useAppState } from '@/components/desktop/Window/context';

import getPaletteColors from '../dither/utils/palette-colors';

export default function usePalette() {
  const [state] = useAppState('dither');

  const palette = useMemo(() => {
    const colors = getPaletteColors(state.palette)
      .flat()
      .map((n) => n / 255);

    return { colors, size: colors.length };
  }, [state.palette]);

  return palette;
}

export type PaletteData = ReturnType<typeof usePalette>;
