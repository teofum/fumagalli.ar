import { nanoid } from 'nanoid';
import type { WindowProps, WindowInit } from '../Window';
import { WindowSizingMode } from '../Window';

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

interface DesktopState {
  windows: WindowProps[];
}

interface CreateAction {
  type: 'create';
  data: WindowInit;
}

interface FocusAction {
  type: 'focus';
  id: string;
}

interface MoveAndResizeAction {
  type: 'moveAndResize';
  id: string;
  data: {
    top?: number;
    left?: number;
    width?: number;
    height?: number;
  };
}

interface ToggleMaximizedAction {
  type: 'toggleMaximized';
  id: string;
}

interface CloseAction {
  type: 'close';
  id: string;
}

type DesktopAction =
  | CreateAction
  | FocusAction
  | MoveAndResizeAction
  | ToggleMaximizedAction
  | CloseAction;

export default function desktopReducer(
  state: DesktopState,
  action: DesktopAction,
): DesktopState {
  console.log(action.type);

  switch (action.type) {
    case 'create': {
      const previous = state.windows.map((window) => ({
        ...window,
        focused: false,
      }));

      const newWindow = createWindow(action.data);
      newWindow.order = previous.length;

      return {
        ...state,
        windows: [...previous, newWindow],
      };
    }
    case 'focus': {
      const target = state.windows.find(({ id }) => id === action.id);
      if (!target) return state;

      const topOrder = state.windows.length - 1;
      return {
        ...state,
        windows: state.windows.map((window) => ({
          ...window,
          focused: window.id === target.id,
          order:
            window.id === target.id
              ? topOrder // Bring target to top
              : window.order > target.order
              ? window.order - 1 // Lower any window that was on top of target by 1
              : window.order, // Keep the rest the same
        })),
      };
    }
    case 'moveAndResize': {
      const updated = state.windows.map((window) =>
        window.id === action.id ? { ...window, ...action.data } : window,
      );

      if (!updated) return state;

      return {
        ...state,
        windows: updated,
      };
    }
    case 'toggleMaximized': {
      const target = state.windows.find(({ id }) => id === action.id);
      if (!target || !target.maximizable) return state;

      const updated = state.windows.map((window) =>
        window.id === action.id
          ? { ...window, maximized: !window.maximized }
          : window,
      );
      return {
        ...state,
        windows: updated,
      };
    }
    case 'close': {
      return {
        ...state,
        windows: [...state.windows.filter(({ id }) => id !== action.id)],
      };
    }
    default:
      return state;
  }
}
