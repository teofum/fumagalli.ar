import { WindowSizingMode, type WindowInit } from '~/components/desktop/Window';
import { type MessageBoxState, defaultMessageBoxState } from './types';

export const messageBox = (
  initialState?: MessageBoxState,
): WindowInit<'messageBox'> => ({
  appType: 'messageBox',
  appState: initialState ?? defaultMessageBoxState,

  title: initialState?.title ?? 'Message box',

  minWidth: 100,
  minHeight: 100,
  width: 400,

  sizingX: WindowSizingMode.FIXED,
  sizingY: WindowSizingMode.AUTO,
});
