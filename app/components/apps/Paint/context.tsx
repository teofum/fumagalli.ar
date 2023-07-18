import { type PropsWithChildren, createContext, useContext } from 'react';
import type { PaintState } from './types';

interface PaintContextType {
  state: PaintState;
  setState: (value: Partial<PaintState>) => void;
}

const PaintContext = createContext<PaintContextType>({} as PaintContextType);

type ProviderProps = PropsWithChildren<PaintContextType>;

export function PaintProvider({ state, setState, children }: ProviderProps) {
  return (
    <PaintContext.Provider value={{ state, setState }}>
      {children}
    </PaintContext.Provider>
  );
}

export function usePaintState() {
  const context = useContext(PaintContext);
  if (!context) throw new Error('usePaintState() not within PaintContext');

  return [context.state, context.setState] as const;
}
