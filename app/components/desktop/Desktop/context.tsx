import type {
  Dispatch,
  PropsWithChildren,
  ReducerAction,
  ReducerState,
} from 'react';
import { createContext, useContext } from 'react';
import type desktopReducer from './reducer';

interface DesktopContextType {
  state: ReducerState<typeof desktopReducer>;
  dispatch: Dispatch<ReducerAction<typeof desktopReducer>>;
}

const DesktopContext = createContext<DesktopContextType>(
  {} as DesktopContextType,
);

export function DesktopProvider({
  state,
  dispatch,
  children,
}: PropsWithChildren<DesktopContextType>) {
  return (
    <DesktopContext.Provider value={{ state, dispatch }}>
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
