import { type PropsWithChildren, createContext, useContext } from 'react';
import type { PaintSettings, PaintState, Rect } from './types';

interface PaintContextType {
  state: PaintState;
  setState: (value: Partial<PaintState>) => void;
  clear: () => void;
  select: (selectionRect: Rect, mask?: boolean) => void;
  deselect: () => void;
  pasteIntoSelection: (data: ImageData) => void;
  invert: () => void;
  flip: (mode: 'horizontal' | 'vertical' | 'both') => void;
  rotate: (mode: 'cw' | 'ccw') => void;
  selectionCanvas: HTMLCanvasElement | null;
  settings: PaintSettings;
  set: (settings: Partial<PaintSettings>) => void;
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
