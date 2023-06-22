import type { PropsWithChildren } from 'react';
import { createContext, useContext } from 'react';

import type { WindowProps } from './Window';

const WindowContext = createContext<WindowProps>({} as WindowProps);

type ProviderProps = PropsWithChildren<{ value: WindowProps }>;

export function WindowProvider({ value, children }: ProviderProps) {
  return (
    <WindowContext.Provider value={value}>{children}</WindowContext.Provider>
  );
}

export function useWindow() {
  const context = useContext(WindowContext);
  if (!context)
    throw new Error('useWindow() must be used inside Window context');

  return context;
}
