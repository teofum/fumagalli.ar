import type { FSObject } from '~/content/types';
import type { Folder } from '~/schemas/folder';

export default function isFolder(
  fileOrFolder: FSObject,
): fileOrFolder is Folder {
  return fileOrFolder._type === 'folder';
}
