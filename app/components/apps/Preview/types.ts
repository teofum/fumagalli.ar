import type { MarkdownFile, ImageFile } from '~/content/types';

export type PreviewSupportedFile = MarkdownFile | ImageFile;
export const previewSupportedFileTypes = ['md', 'image'];

export interface PreviewState {
  file?: PreviewSupportedFile;
  filePath?: string;
}

export const previewDefaultState: PreviewState = {};
