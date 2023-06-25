import type {
  Dispatch,
  PropsWithChildren,
  ReducerAction,
  ReducerState,
} from 'react';
import { createContext, useContext } from 'react';

import type desktopReducer from './reducer';
import type { WindowInit } from '../Window';

interface DesktopContextType {
  state: ReducerState<typeof desktopReducer>;
  dispatch: Dispatch<ReducerAction<typeof desktopReducer>>;
  launch: (app: WindowInit) => void;
  shutdown: () => void;
}

const DesktopContext = createContext<DesktopContextType>(
  {} as DesktopContextType,
);

type ProviderProps = PropsWithChildren<{
  state: ReducerState<typeof desktopReducer>;
  dispatch: Dispatch<ReducerAction<typeof desktopReducer>>;
  shutdown: () => void;
}>;

export function DesktopProvider({
  state,
  dispatch,
  shutdown,
  children,
}: ProviderProps) {
  const launch = (app: WindowInit) => dispatch({ type: 'create', data: app });

  return (
    <DesktopContext.Provider value={{ state, dispatch, launch, shutdown }}>
      {children}
    </DesktopContext.Provider>
  );
}

export function useDesktop() {
  const context = useContext(DesktopContext);
  if (!context)
    throw new Error('useDesktop() must be used inside Desktop context');

  return context;
}
