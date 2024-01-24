import type { Folder } from '~/schemas/folder';
import type { Image } from '~/schemas/image';

/**
 * Filesystem object types
 */
interface FSObjectBase {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  name: string;
}

export type Directory = Folder;

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
