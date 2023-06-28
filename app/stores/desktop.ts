import { nanoid } from 'nanoid';
import type { WindowProps, WindowInit } from '../components/desktop/Window';
import { WindowSizingMode } from '../components/desktop/Window';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export function createWindow(props: WindowInit): WindowProps {
  return {
    id: nanoid(),

    title: 'New Window',
    icon: 'app',

    top: 200,
    left: 200,
    width: 640,
    height: 480,

    maximized: false,
    focused: true,
    order: 0,

    minWidth: 200,
    minHeight: 200,

    sizingX: WindowSizingMode.RESIZABLE,
    sizingY: WindowSizingMode.RESIZABLE,

    maximizable: true,

    ...props,
  };
}

type WindowSizeProps = Partial<
  Pick<WindowProps, 'top' | 'left' | 'width' | 'height'>
>;

interface DesktopState {
  windows: WindowProps[];
  shutdownDialog: boolean;
}

interface DesktopActions {
  // Window-related actions
  launch: (init: WindowInit) => void;
  focus: (id: string) => void;
  toggleMaximized: (id: string) => void;
  close: (id: string) => void;
  moveAndResize: (id: string, data: WindowSizeProps) => void;
  setWindowProps: (id: string, data: Partial<WindowProps>) => void;

  // Other actions
  shutdown: (open?: boolean) => void;
}

/**
 * Desktop store handles UI-related state: active windows, desktop state, etc.
 */
const useDesktopStore = create<DesktopState & DesktopActions>()(
  persist(
    (set, get) => ({
      /**
       * State
       */
      windows: [],
      shutdownDialog: false,

      /**
       * Actions
       */
      launch: (init) =>
        set(({ windows }) => ({
          windows: [
            ...windows.map((window) => ({ ...window, focused: false })),
            { ...createWindow(init), order: windows.length, focused: true },
          ],
        })),
      focus: (id) =>
        set(({ windows }) => {
          const target = windows.find((window) => window.id === id);
          if (!target) return {};

          const top = windows.length - 1;
          return {
            windows: windows.map((window) => ({
              ...window,
              focused: window.id === id,
              order:
                window.id === target.id
                  ? top // Bring target to top
                  : window.order > target.order
                  ? window.order - 1 // Lower any window on top of target by 1
                  : window.order, // Keep the rest the same
            })),
          };
        }),
      toggleMaximized: (id) =>
        set(({ windows }) => {
          const target = windows.find((window) => window.id === id);
          if (!target || !target.maximizable) return {};

          return {
            windows: windows.map((window) =>
              window.id === id
                ? { ...window, maximized: !window.maximized }
                : window,
            ),
          };
        }),
      close: (id) =>
        set(({ windows }) => ({
          windows: windows.filter((window) => window.id !== id),
        })),
      moveAndResize: (id, data) =>
        set(({ windows }) => ({
          windows: windows.map((window) =>
            window.id === id ? { ...window, ...data } : window,
          ),
        })),
      setWindowProps: (id, data) =>
        set(({ windows }) => ({
          windows: windows.map((window) =>
            window.id === id ? { ...window, ...data } : window,
          ),
        })),
      shutdown: (open = false) => set(() => ({ shutdownDialog: open })),
    }),
    { name: 'desktop-storage' },
  ),
);

export default useDesktopStore;
