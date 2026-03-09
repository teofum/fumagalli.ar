import { useMemo } from 'react';

import { useAppState } from '@/components/desktop/Window/context';
import { useDitherLabImageStore } from '@/stores/dither-lab.store';

export default function useImage() {
  const imageStore = useDitherLabImageStore();
  const [state] = useAppState('dither');

  const image = useMemo(
    () => (state.image ? imageStore.items['image'] : null),
    [imageStore.items, state.image],
  );

  return image;
}
