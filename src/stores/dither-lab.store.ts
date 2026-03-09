import { create } from 'zustand';
import { combine, persist } from 'zustand/middleware';
import createOPFSStorage, {
  StorageItem,
  StorageState,
} from './storage/opfs-storage';

type ImageMetadata = {
  filename: string;
  width: number;
  height: number;
  url: string | null;
};

export type ImageAsset = StorageItem<ImageMetadata>;

type StorageType = StorageState<ImageAsset>;

const initialState: StorageType = { items: {} };

export const useDitherLabImageStore = create(
  persist(
    combine(initialState, (set) => ({
      addImage: async (name: string, item: ImageAsset) => {
        set(({ items }) => ({
          items: {
            ...items,
            [name]: item,
          },
        }));
      },

      removeImage: (name: string) =>
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        set(({ items: { [name]: _, ...rest } }) => ({ items: rest })),

      clear: () => set(initialState),
    })),
    {
      name: 'asset-storage',
      storage: createOPFSStorage({ rootPath: '/ditherlab' }),
      merge: (persisted, current) => {
        const persistedItems = (persisted as StorageType).items;

        return {
          ...current,
          items: {
            ...current.items,
            ...persistedItems,
          },
        };
      },
    },
  ),
);
