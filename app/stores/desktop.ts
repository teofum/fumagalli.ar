import { nanoid } from 'nanoid';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import merge from 'ts-deepmerge';

import type { AnyWindowProps } from '~/components/desktop/Window/Window';
import type { WindowProps, WindowInit } from '../components/desktop/Window';
import { WindowSizingMode } from '../components/desktop/Window';
import clamp from '~/utils/clamp';

// Schema version, ensures incompatible data isn't loaded
// CHANGING THIS WILL WIPE ALL DATA FOR EVERYONE.
// Update ONLY for breaking changes to the schema.
const SCHEMA_VERSION = 3;

// V2: FS restructuring, updated to prevent stale explorer windows
// V3: Switched to Sanity for content

const defaultWindowProps = {
  title: 'New Window',
  icon: 'app',

  children: [],

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
};

function createWindow<T extends string>(
  init: WindowInit<T>,
  parent?: AnyWindowProps,
): WindowProps<T> {
  const window = {
    id: nanoid(),
    ...defaultWindowProps,
    ...init,
    parentId: parent?.id,
  };

  const desktopEl = document.querySelector('#desktop') as HTMLDivElement;
  const desktop = desktopEl.getBoundingClientRect();

  const maxTop = Math.max(0, desktop.height - window.height);
  const maxLeft = Math.max(0, desktop.width - window.width);

  const fixedWidth = window.sizingX === WindowSizingMode.FIXED;
  const minWidth = fixedWidth ? window.width : window.minWidth;

  const fixedHeight = window.sizingY === WindowSizingMode.FIXED;
  const minHeight = fixedHeight ? window.height : window.minHeight;

  // If the window is a modal, place it on top of parent
  if (parent) {
    window.top = parent.top + 50;
    window.left = parent.left + 50;
  }

  // If the window overflows the desktop on its default position, move it toward
  // the top left until it doesn't
  window.top = clamp(window.top, 0, maxTop);
  window.left = clamp(window.left, 0, maxLeft);

  // If the window is still overflowing (larger than desktop), resize it to fit
  window.width = clamp(window.width, minWidth, desktop.width);
  window.height = clamp(window.height, minHeight, desktop.height);

  return window;
}

function addWindow<T extends string>(
  windows: AnyWindowProps[],
  init: WindowInit<T>,
  parent?: AnyWindowProps,
): AnyWindowProps[] {
  return [
    ...windows.map((window) => ({ ...window, focused: false })),
    { ...createWindow(init, parent), order: windows.length, focused: true },
  ];
}

function findWindow(windows: AnyWindowProps[], id: string, parentId?: string) {
  if (parentId) {
    const parent = windows.find((window) => window.id === parentId);
    return parent?.children.find((window) => window.id === id);
  } else return windows.find((window) => window.id === id);
}

/**
 * Updates a window with new data. Target can be at root level or a child of a
 * root level window.
 * @param windows
 * @param target
 * @param data
 * @returns
 */
function updateWindow<T extends string>(
  windows: AnyWindowProps[],
  target: WindowProps<T>,
  data: Partial<WindowProps<T>>,
): AnyWindowProps[] {
  if (target.parentId) {
    return windows.map((window) =>
      window.id === target.parentId
        ? {
            ...window,
            children: window.children.map((window) =>
              window.id === target.id ? { ...window, ...data } : window,
            ),
          }
        : window,
    );
  } else {
    return windows.map((window) =>
      window.id === target.id ? { ...window, ...data } : window,
    );
  }
}

export type WindowSizeProps = Partial<
  Pick<AnyWindowProps, 'top' | 'left' | 'width' | 'height'>
>;

interface DesktopState {
  windows: AnyWindowProps[];
  shutdownDialog: boolean;

  _schema: number;
}

interface DesktopActions {
  // Window-related actions
  launch: <T extends string>(init: WindowInit<T>, parentId?: string) => void;
  focus: (id: string) => void;
  toggleMaximized: (id: string, parentId?: string) => void;
  close: (id: string, parentId?: string) => void;
  moveAndResize: (id: string, data: WindowSizeProps, parentId?: string) => void;
  setTitle: (id: string, title: string, parentId?: string) => void;
  setWindowProps: <T extends string>(
    id: string,
    data: Partial<WindowProps<T>>,
    parentId?: string,
  ) => void;

  // Other actions
  openShutdown: (open?: boolean) => void;
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
      _schema: SCHEMA_VERSION,

      /**
       * Actions
       */
      launch: (init, parentId) =>
        set(({ windows }) => {
          if (parentId) {
            const parent = findWindow(windows, parentId);
            if (!parent) return {};

            return {
              windows: [
                ...windows.map((window) =>
                  window.id === parent.id
                    ? {
                        ...window,
                        focused: true,
                        children: addWindow(window.children, init, parent),
                      }
                    : { ...window, focused: false },
                ),
              ],
            };
          } else return { windows: addWindow(windows, init) };
        }),
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

              // Modals always share focus state with their parent
              children: window.children.map((child) => ({
                ...child,
                focused: window.id === id,
              })),
            })),
          };
        }),
      toggleMaximized: (id, parentId) =>
        set(({ windows }) => {
          const target = findWindow(windows, id, parentId);
          if (!target || !target.maximizable) return {};

          return {
            windows: updateWindow(windows, target, {
              maximized: !target.maximized,
            }),
          };
        }),
      close: (id, parentId) =>
        set(({ windows }) => {
          if (parentId) {
            return {
              windows: windows.map((window) =>
                window.id === parentId
                  ? {
                      ...window,
                      children: window.children.filter((w) => w.id !== id),
                    }
                  : window,
              ),
            };
          } else return { windows: windows.filter((w) => w.id !== id) };
        }),
      moveAndResize: (id, data, parentId) =>
        set(({ windows }) => {
          const target = findWindow(windows, id, parentId);
          if (!target) return {};

          return { windows: updateWindow(windows, target, data) };
        }),
      setTitle: (id, title, parentId) =>
        set(({ windows }) => {
          const target = findWindow(windows, id, parentId);
          if (!target) return {};

          return { windows: updateWindow(windows, target, { title }) };
        }),
      setWindowProps: (id, data, parentId) =>
        set(({ windows }) => {
          const target = findWindow(windows, id, parentId);
          if (!target) return {};

          return { windows: updateWindow(windows, target, data) };
        }),
      openShutdown: (open = true) => set(() => ({ shutdownDialog: open })),
    }),
    {
      name: 'desktop-storage',
      merge: (persisted, current) => {
        const stored = persisted as typeof current;

        // Wipe persisted state on schema version change
        // This will allow me to safely introduce breaking schema changes
        // without causing the app to crash for existing users
        if (stored._schema !== current._schema) return current;

        // We'll assume the persisted state is valid and hasn't been tampered
        // with, otherwise making this type-safe is a nightmare
        return merge.withOptions({ mergeArrays: false }, current, {
          ...stored,
          // Destroy modal windows on load
          windows: stored.windows.map((window) => ({
            ...window,
            children: [],
          })),
        }) as any;
      },
    },
  ),
);

export default useDesktopStore;
