import type { FSObject } from '~/content/types';

export default function getReadableFileType(item: FSObject) {
  if (item.class === 'dir') return 'Folder';

  const extension = item.name.split('.').at(-1);

  switch (item.type) {
    case 'image':
      return `${extension?.toUpperCase()} Image`;
    case 'md':
      return 'Markdown File';
    case 'dos':
      return 'DOSEmu ROM';
    case 'app':
      return 'Application';
    case 'file':
      return `${extension?.toUpperCase()} File`;
    default:
      return 'Unknown';
  }
}
