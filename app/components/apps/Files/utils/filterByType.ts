import type { FilesState } from '../types';
import type { ItemStub } from '~/schemas/folder';

export default function filterByType(
  items: ItemStub[],
  typeFilter: FilesState['typeFilter'],
) {
  return items.filter(
    (item) =>
      !typeFilter ||
      item._type === 'folder' ||
      (typeFilter as string[]).includes(item._type),
  );
}
