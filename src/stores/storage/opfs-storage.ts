import { PersistStorage } from 'zustand/middleware';

type OPFSStorageOptions = {
  rootPath: string;
};

type StorageItem<TMetadata> = {
  meta: TMetadata;
  data: Uint8Array<ArrayBuffer>;
};

type StorageState<T> = {
  items: { [key: string]: T };
};

export default function createOPFSStorage<TMetadata>(
  options: OPFSStorageOptions,
) {
  const normalizedPath = options.rootPath
    .split('/')
    .filter((segment) => segment !== '');

  const getStorageDirectory = async () => {
    const opfsRoot = await navigator.storage.getDirectory();
    let storageDirectory = opfsRoot;
    for (const dirName of normalizedPath) {
      storageDirectory = await storageDirectory.getDirectoryHandle(dirName, {
        create: true,
      });
    }

    return storageDirectory;
  };

  return {
    getItem: async (name) => {
      const index = window.localStorage.getItem(name);
      if (!index) {
        return { state: { items: {} }, version: 0 };
      }

      const { items } = JSON.parse(index) as { items: [string, TMetadata][] };

      const storageDirectory = await getStorageDirectory();
      const itemData = await Promise.all(
        items.map(async ([name, meta]) => {
          try {
            const fileHandle = await storageDirectory.getFileHandle(name);
            const file = await fileHandle.getFile();
            const data = new Uint8Array(await file.arrayBuffer());

            return { name, meta, data };
          } catch (e) {
            console.error(`Failed to load ${name}: ${e}`);
            throw new Error(`Failed to load ${name}: ${e}`);
          }
        }),
      );

      const state: StorageState<StorageItem<TMetadata>> = { items: {} };
      for (const { name, meta, data } of itemData) {
        state.items[name] = { meta, data };
      }

      return { state, version: 0 };
    },
    setItem: async (name, value) => {
      const { state } = value;

      const storageDirectory = await getStorageDirectory();
      const items = await Promise.all(
        Object.entries(state.items).map(async ([name, { meta, data }]) => {
          try {
            const file = await storageDirectory.getFileHandle(name, {
              create: true,
            });
            const writer = await file.createWritable();

            writer.truncate(data.byteLength);
            writer.write({ type: 'write', data, position: 0 });
            writer.close();
          } catch (e) {
            console.warn(`Failed to save ${name}: ${e}`);
          }

          return [name, meta] as const;
        }),
      );

      window.localStorage.setItem(name, JSON.stringify({ items: items }));
    },
    removeItem: async (name) => {
      const index = window.localStorage.getItem(name);
      if (!index) return;

      const { items } = JSON.parse(index) as { items: [string, TMetadata][] };

      const opfsRoot = await navigator.storage.getDirectory();
      await Promise.all(
        items.map(async ([name]) => {
          try {
            opfsRoot.removeEntry(name);
          } catch (e) {
            console.warn(`Failed to delete ${name}: ${e}`);
          }
        }),
      );

      window.localStorage.removeItem(name);
    },
  } satisfies PersistStorage<StorageState<StorageItem<TMetadata>>, void>;
}
