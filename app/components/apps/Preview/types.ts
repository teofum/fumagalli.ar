import type { MarkdownFile, ImageFile, AnyFile } from '~/content/types';

export type PreviewSupportedFile = MarkdownFile | ImageFile;
export const previewSupportedFileTypes = ['md', 'image'];

export function isPreviewable(file: AnyFile): file is PreviewSupportedFile {
  return previewSupportedFileTypes.includes(file.type);
}

export interface PreviewState {
  file?: PreviewSupportedFile;
  filePath?: string;
}

export const previewDefaultState: PreviewState = {};
