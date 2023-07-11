import FS_ROOT from '~/content/dir';

export default function resolvePath(path: string[]) {
  let dir = FS_ROOT;
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
}
