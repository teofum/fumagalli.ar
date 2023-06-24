/**
 * Filesystem object types
 */
interface FSObjectBase {
  name: string;
}

export interface Directory extends FSObjectBase {
  class: 'dir';

  items: FSObject[];
}

export interface FileBase extends FSObjectBase {
  class: 'file';
}

export interface ImageFile extends FileBase {
  type: 'image';

  altText?: string;
}

export interface MarkdownFile extends FileBase {
  type: 'md';
}

export type AnyFile = ImageFile | MarkdownFile;

export type FSObject = Directory | AnyFile;
