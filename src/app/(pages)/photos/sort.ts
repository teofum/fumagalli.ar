import { Photo } from '@/schemas/photos';
import { SearchParams } from '@/utils/types';

const DEFAULT_SORT_MODE: Record<string, 'desc' | 'asc'> = {
  date: 'desc',
  filename: 'asc',
};

const sortFns: Record<string, (a: Photo, b: Photo) => number> = {
  date: (a, b) =>
    (a.metadata.exif.dateTime?.getTime() ?? 0) -
    (b.metadata.exif.dateTime?.getTime() ?? 0),
  filename: (a, b) => a.originalFilename.localeCompare(b.originalFilename),
};

export default function getSortFn(sort: SearchParams[string]) {
  const [sortBy, sortMode] =
    typeof sort === 'string' ? sort.split(',') : ['date', 'desc'];

  const fn = sortFns[sortBy];
  const mode = sortMode ?? DEFAULT_SORT_MODE[sortBy] ?? 'asc';

  return mode === 'desc' ? (a: Photo, b: Photo) => fn(b, a) : fn;
}
