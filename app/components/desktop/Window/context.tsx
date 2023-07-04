import type { PropsWithChildren } from 'react';
import { createContext, useContext } from 'react';

import useDesktopStore from '~/stores/desktop';
import type { AppState } from '~/components/apps/renderApp';
import type { WindowInit, WindowProps } from './Window';

interface WindowContextType<T extends string> extends WindowProps<T> {
  focus: () => void;
  toggleMaximized: () => void;
  close: () => void;
  modal: <T extends string>(init: WindowInit<T>) => void;
}

const WindowContext = createContext<WindowContextType<string>>(
  {} as WindowContextType<string>,
);

type ProviderProps<T extends string> = PropsWithChildren<{
  windowProps: WindowProps<T>;
}>;

export function WindowProvider<T extends string>({
  windowProps,
  children,
}: ProviderProps<T>) {
  const desktop = useDesktopStore();

  const focus = () => desktop.focus(windowProps.id);
  const close = () => desktop.close(windowProps.id, windowProps.parentId);
  const toggleMaximized = () =>
    desktop.toggleMaximized(windowProps.id, windowProps.parentId);

  const modal = <T extends string>(init: WindowInit<T>) =>
    desktop.launch(init, windowProps.id);

  const value = { ...windowProps, focus, toggleMaximized, close, modal };

  return (
    <WindowContext.Provider value={value}>{children}</WindowContext.Provider>
  );
}

export function useWindow<T extends string>(appType?: T) {
  const context = useContext(WindowContext);
  if (!context)
    throw new Error('useWindow() must be used inside Window context');

  if (appType && context.appType !== appType)
    throw new Error(
      `useWindow() expected app ${appType}, but is being called inside app ${context.appType}`,
    );

  return context as WindowContextType<T>;
}

export function useAppState<T extends string>(appType: T) {
  const { setWindowProps } = useDesktopStore();
  const { appState, id, parentId } = useWindow(appType);

  const setState = (state: AppState<T>) =>
    setWindowProps(id, { appState: state }, parentId);

  return [appState, setState] as const;
}
