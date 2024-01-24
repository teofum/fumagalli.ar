import type { FSObject } from '~/content/types';
import type { FilesState } from '../types';

export default function filterByType(
  items: FSObject[],
  typeFilter: FilesState['typeFilter'],
) {
  return items.filter(
    (item) =>
      !typeFilter ||
      item._type === 'folder' ||
      (typeFilter as string[]).includes(item._type),
  );
}
