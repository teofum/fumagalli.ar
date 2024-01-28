import type { ItemStub } from '~/schemas/folder';

export default function isFolder(fileOrFolder: ItemStub) {
  return fileOrFolder._type === 'folder';
}
