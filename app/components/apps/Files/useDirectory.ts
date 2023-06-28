import { useMemo } from 'react';
import root from '~/content/dir';

export default function useDirectory(path: string[]) {
  return useMemo(() => {
    let dir = root;
    let relativePath = path.slice();

    while (relativePath.length > 0) {
      const [child, ...rest] = relativePath;
      if (child) {
        // Ignore empty segments
        const next = dir.items.find((item) => item.name === child);
        if (!next || next.class !== 'dir') return null;

        dir = next;
      }
      relativePath = rest;
    }

    return dir;
  }, [path]);
}
