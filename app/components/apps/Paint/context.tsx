import { type PropsWithChildren, createContext, useContext } from 'react';
import type { PaintState, Rect } from './types';

interface PaintContextType {
  state: PaintState;
  setState: (value: Partial<PaintState>) => void;
  clear: () => void;
  select: (selectionRect: Rect, mask?: boolean) => void;
  deselect: () => void;
  pasteIntoSelection: (data: ImageData) => void;
  selectionCanvas: HTMLCanvasElement | null;
}

const PaintContext = createContext<PaintContextType>({} as PaintContextType);

type ProviderProps = PropsWithChildren<PaintContextType>;

export function PaintProvider({ children, ...props }: ProviderProps) {
  return (
    <PaintContext.Provider value={props}>
      {children}
    </PaintContext.Provider>
  );
}

export function usePaintContext() {
  return useContext(PaintContext);
}

export function usePaintState() {
  const context = useContext(PaintContext);
  if (!context) throw new Error('usePaintState() not within PaintContext');

  return [context.state, context.setState] as const;
}