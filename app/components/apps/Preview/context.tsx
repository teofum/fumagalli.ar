import type { PropsWithChildren } from 'react';
import { createContext, useContext } from 'react';
import type { ImageFile, MarkdownFile } from '~/content/dir';

export const previewSupportedFileTypes = ['md', 'image'];
export type PreviewSupportedFile = MarkdownFile | ImageFile;

interface PreviewAppContextType {
  file: PreviewSupportedFile;
}

const PreviewAppContext = createContext<PreviewAppContextType>(
  {} as PreviewAppContextType,
);

type ProviderProps = PropsWithChildren<PreviewAppContextType>;

export function PreviewAppProvider({ file, children }: ProviderProps) {
  return (
    <PreviewAppContext.Provider value={{ file }}>
      {children}
    </PreviewAppContext.Provider>
  );
}

export function usePreviewApp() {
  const context = useContext(PreviewAppContext);
  if (!context)
    throw new Error('usePreviewApp() must be used inside PreviewApp context');

  return context;
}
