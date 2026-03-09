import { useMemo } from 'react';

import { useAppState } from '@/components/desktop/Window/context';

import thresholds from '../dither/thresholdMaps';

export type RenderSettings = {
  clistSize?: number;
  threshold?: keyof typeof thresholds | 'random';
};

const clistSize: { [key: string]: number | undefined } = {
  high: 64,
  medium: 16,
  low: 4,
};

export default function useRenderSettings() {
  const [state] = useAppState('dither');

  const settings = useMemo<RenderSettings>(
    () => ({
      clistSize: clistSize[state.settings.quality] ?? 64,
      threshold:
        (state.settings.threshold as RenderSettings['threshold']) ?? 'bayer8',
    }),
    [state.settings],
  );

  return settings;
}
