import type { AnyFile } from '~/schemas/file';
import type { Folder as FolderType } from '~/schemas/folder';

/**
 * Filesystem object types
 */
export type Folder = FolderType;
export type FSObject = Folder | AnyFile;
