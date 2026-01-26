import { useCallback, useState } from 'react';
import type { Folder } from '@/schemas/folder';
import useFetch from '@/hooks/use-fetch';

// Simple in-memory cache, speeds up navigation and saves sanity quota
// Resets itself on site reload so I don't have to worry about invalidation
const folderCache: Map<string, Folder> = new Map();

export default function useFolder() {
  const [dir, setDir] = useState<Folder>();
  const { load: loadRemote } = useFetch<Folder>();

  const load = useCallback(
    async (id: string) => {
      if (folderCache.has(id)) {
        setDir(folderCache.get(id));
      } else {
        const res = await loadRemote(`/api/filesystem?id=${id}`);
        if (res.data) {
          setDir(res.data);
          folderCache.set(res.data?._id, res.data);
        }
      }
    },
    [loadRemote],
  );

  return { load, dir };
}
