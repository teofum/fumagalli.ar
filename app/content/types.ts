/**
 * Filesystem object types
 */
interface FSObjectBase {
  name: string;
  created: number;
  modified: number;
}

export interface Directory extends FSObjectBase {
  class: 'dir';

  items: FSObject[];
}

export interface FileBase extends FSObjectBase {
  class: 'file';
  size: number;
}

export interface GenericFile extends FileBase {
  type: 'file';
}

export interface ImageFile extends FileBase {
  type: 'image';

  altText?: string;
}

export interface MarkdownFile extends FileBase {
  type: 'md';
}

export interface AppFile extends FileBase {
  type: 'app';
}

export type AnyFile = ImageFile | MarkdownFile | AppFile | GenericFile;

export type FSObject = Directory | AnyFile;
