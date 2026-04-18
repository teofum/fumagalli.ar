import { create } from 'zustand';
import { combine, persist } from 'zustand/middleware';

import defaultPalettes from '@/utils/palettes';

const initialState = {
  palettes: defaultPalettes,
};

export const useColorStore = create(
  persist(
    combine(initialState, (set) => ({
      // ...
    })),
    { name: 'color-storage' },
  ),
);
