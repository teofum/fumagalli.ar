import type { PropsWithChildren } from 'react';
import { createContext, useCallback, useContext } from 'react';

import useDesktopStore from '~/stores/desktop';
import type { AppState, AppStateTypes } from '~/components/apps/renderApp';
import type { WindowInit, WindowProps } from './Window';

interface WindowContextType<T extends string, P extends string>
  extends WindowProps<T> {
  focus: () => void;
  toggleMaximized: () => void;
  close: () => void;
  modal: <T extends string>(init: WindowInit<T>) => void;

  parent?: WindowProps<P>;
}

const WindowContext = createContext<WindowContextType<string, string>>(
  {} as WindowContextType<string, string>,
);

type ProviderProps<T extends string, P extends string> = PropsWithChildren<{
  window: WindowProps<T>;
  parent?: WindowProps<P>;
}>;

export function WindowProvider<T extends string, P extends string>({
  window,
  parent,
  children,
}: ProviderProps<T, P>) {
  const desktop = useDesktopStore();

  const focus = () => desktop.focus(window.id);
  const close = () => desktop.close(window.id, parent?.id);
  const toggleMaximized = () => desktop.toggleMaximized(window.id, parent?.id);

  const modal = <T extends string>(init: WindowInit<T>) =>
    desktop.launch(init, window.id);

  const value = { ...window, focus, toggleMaximized, close, modal, parent };

  return (
    <WindowContext.Provider value={value}>{children}</WindowContext.Provider>
  );
}

export function useWindow<T extends string, P extends string = string>(
  appType?: T,
  parentType?: P,
) {
  const context = useContext(WindowContext);
  if (!context)
    throw new Error('useWindow() must be used inside Window context');

  if (appType && context.appType !== appType)
    throw new Error(
      `useWindow() expected app ${appType}, but is being called inside app ${context.appType}`,
    );

  return context as WindowContextType<T, P>;
}

export function useAppState<T extends keyof AppStateTypes>(appType: T) {
  const { setWindowProps } = useDesktopStore();
  const { appState, id, parentId } = useWindow(appType);

  const setState = useCallback(
    (state: Partial<AppState<T>>) =>
      setWindowProps<T>(id, { appState: { ...appState, ...state } }, parentId),
    [id, parentId, appState, setWindowProps],
  );

  return [appState, setState] as const;
}

export function useParentState<P extends keyof AppStateTypes>(parentType: P) {
  const { setWindowProps } = useDesktopStore();
  const { parent } = useWindow('', parentType);

  if (!parent)
    throw new Error(`useParentState() must be used within modal window.`);
  const { appState, id, parentId } = parent;

  const setState = useCallback(
    (state: Partial<AppState<P>>) =>
      setWindowProps<P>(id, { appState: { ...appState, ...state } }, parentId),
    [id, parentId, appState, setWindowProps],
  );

  return [parent.appState, setState] as const;
}
