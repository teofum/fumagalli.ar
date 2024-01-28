import type { ItemStub } from '~/schemas/folder';

export default function getReadableFileType(item: ItemStub) {
  const extension = item.name.split('.').at(-1);

  switch (item._type) {
    case 'folder':
      return 'Folder';
    case 'fileImage':
      return `${extension?.toUpperCase()} Image`;
    case 'fileRichText':
      return 'Rich Text File';
    case 'fileMDX':
      return 'MDX File';
    case 'fileDos':
      return 'DOSEmu ROM';
    case 'fileApp':
      return 'Application';
    default:
      return `${extension?.toUpperCase()} File`;
  }
}
