import type { FSObject } from '~/content/types';

export default function getIconUrl(item: FSObject, size: 16 | 32) {
  const type = item._type === 'folder' ? 'dir' : item._type;

  if (type === 'app') {
    const appName = item.name.split('.')[0];
    return `/fs/Applications/${appName}/icon_${size}.png`;
  }
  return `/fs/System Files/Icons/FileType/${type}_${size}.png`;
}
