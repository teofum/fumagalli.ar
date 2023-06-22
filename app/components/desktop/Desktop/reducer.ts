import { nanoid } from 'nanoid';
import type { WindowProps } from '../Window';

interface DesktopState {
  windows: WindowProps[];
}

interface CreateAction {
  type: 'create';
}

interface FocusAction {
  type: 'focus';
  id: string;
}

interface CloseAction {
  type: 'close';
  id: string;
}

type DesktopAction = CreateAction | FocusAction | CloseAction;

export default function desktopReducer(
  state: DesktopState,
  action: DesktopAction,
): DesktopState {
  switch (action.type) {
    case 'create': {
      return {
        ...state,
        windows: [...state.windows, { id: nanoid() }],
      };
    }
    case 'focus': {
      const focus = state.windows.find(({ id }) => id === action.id);
      const rest = state.windows.filter(({ id }) => id !== action.id);

      if (!focus) return state;
      return {
        ...state,
        windows: [...rest, focus],
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
