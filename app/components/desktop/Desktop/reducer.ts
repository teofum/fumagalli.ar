import { nanoid } from 'nanoid';
import { WindowSizingMode, type WindowProps } from '../Window';

function createWindow(props?: Omit<Partial<WindowProps>, 'id'>): WindowProps {
  return {
    id: nanoid(),

    title: 'New Window',
    icon: 'app',

    top: 200,
    left: 200,
    width: 640,
    height: 480,

    maximized: false,

    minWidth: 200,
    minHeight: 200,

    sizingX: WindowSizingMode.FIXED,
    sizingY: WindowSizingMode.FIXED,

    maximizable: true,

    ...props,
  };
}

interface DesktopState {
  windows: WindowProps[];
}

interface CreateAction {
  type: 'create';
  data?: Omit<Partial<WindowProps>, 'id'>;
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
  switch (action.type) {
    case 'create': {
      return {
        ...state,
        windows: [...state.windows, createWindow(action.data)],
      };
    }
    case 'focus': {
      const target = state.windows.find(({ id }) => id === action.id);
      const rest = state.windows.filter(({ id }) => id !== action.id);

      if (!target) return state;
      return {
        ...state,
        windows: [...rest, target],
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
