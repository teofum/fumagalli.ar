import type { MarkdownFile, ImageFile, AnyFile } from '~/content/types';

export type PreviewSupportedFile = MarkdownFile | ImageFile;
export const previewSupportedFileTypes: AnyFile['type'][] = ['md', 'image'];

export function isPreviewable(file: AnyFile): file is PreviewSupportedFile {
  return previewSupportedFileTypes.includes(file.type);
}

export interface PreviewState {
  // General
  file?: PreviewSupportedFile;
  filePath?: string;

  // Image preview
  zoom?: number;
}

export const previewDefaultState: PreviewState = {};

export interface PreviewModeProps {
  commonMenu?: React.ReactNode;
}
