import type { FSObject } from '~/content/types';
import type { FilesState } from '../types';

export default function filterByType(
  items: FSObject[],
  typeFilter: FilesState['typeFilter'],
) {
  return items.filter(
    (item) =>
      !typeFilter || item.class === 'dir' || typeFilter.includes(item.type),
  );
}
