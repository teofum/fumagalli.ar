import { useCallback, useEffect, useState } from "react";
import type { Folder } from "@/schemas/folder";

// Simple in-memory cache, speeds up navigation and saves sanity quota
// Resets itself on site reload so I don't have to worry about invalidation
const folderCache: Map<string, Folder> = new Map();

export default function useFolder() {
  const [dir, setDir] = useState<Folder>();
  // const { load: fetch, data } = useFetcher<Folder>();

  // useEffect(() => {
  //   if (!data) return;

  //   setDir(data);
  //   folderCache.set(data?._id, data);
  // }, [data]);

  const load = useCallback(
    (id: string) => {
      if (folderCache.has(id)) setDir(folderCache.get(id));
      else fetch(`/api/filesystem?id=${id}`);
    },
    [fetch],
  );

  return { load, dir };
}
