import type { FSObject } from '~/content/types';

const CUSTOM_ICONS: Record<string, string> = {
  Documents: 'documents',
  Applications: 'applications',
  'System Files': 'system',
  'My Computer': 'my-computer',
};

export default function getIconUrl(item: FSObject, size: 16 | 32) {
  const type = item.class === 'file' ? item.type : item.class;

  if (type === 'dir' && CUSTOM_ICONS[item.name]) {
    return `/fs/System Files/Icons/Folders/${CUSTOM_ICONS[item.name]}_${size}.png`;
  }
  if (type === 'app') {
    const appName = item.name.split('.')[0];
    return `/fs/Applications/${appName}/icon_${size}.png`;
  }
  return `/fs/System Files/Icons/FileType/${type}_${size}.png`;
}
