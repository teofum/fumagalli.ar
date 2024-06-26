import type { AnyFile, ImageFile, RichTextFile, MDXFile } from '~/schemas/file';
import type { ItemStub } from '~/schemas/folder';

export type PreviewSupportedFile = ImageFile | RichTextFile | MDXFile;
export const previewSupportedFileTypes: AnyFile['_type'][] = [
  'fileImage',
  'fileRichText',
  'fileMDX',
];

export function isPreviewable(file: ItemStub) {
  return previewSupportedFileTypes.includes(file._type as any);
}

export interface PreviewState {
  // General
  file?: PreviewSupportedFile;
  fileStub?: ItemStub;

  // Image preview
  zoom?: number;
}

export const previewDefaultState: PreviewState = {};

export interface PreviewModeProps {
  commonMenu?: React.ReactNode;
}
