import type { Image } from '~/schemas/image';

/**
 * Filesystem object types
 */
interface FSObjectBase {
  _id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
}

export interface Directory extends FSObjectBase {
  _type: 'folder';
  parent?: Directory;
  items: FSObject[];
}

export interface ImageFile extends FSObjectBase {
  _type: 'fileImage';

  content: Image;
}

export interface MarkdownFile extends FSObjectBase {
  _type: 'md';
}

export interface MDXFile extends FSObjectBase {
  _type: 'mdx';
}

export interface DosRomFile extends FSObjectBase {
  _type: 'dos';
}

export interface AppFile extends FSObjectBase {
  _type: 'app';
}

export type AnyFile = ImageFile | MarkdownFile | MDXFile | DosRomFile | AppFile;

export type FSObject = Directory | AnyFile;
