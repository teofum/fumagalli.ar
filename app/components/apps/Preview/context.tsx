import type { PropsWithChildren } from 'react';
import { createContext, useContext } from 'react';

import type { PreviewSupportedFile } from './types';

interface PreviewAppContextType {
  file: PreviewSupportedFile;
  resourceUrl: string;
}

const PreviewAppContext = createContext<PreviewAppContextType>(
  {} as PreviewAppContextType,
);

type ProviderProps = PropsWithChildren<PreviewAppContextType>;

export function PreviewAppProvider({ file, resourceUrl, children }: ProviderProps) {
  return (
    <PreviewAppContext.Provider value={{ file, resourceUrl }}>
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
