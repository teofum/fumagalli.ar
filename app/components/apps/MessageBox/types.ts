export interface MessageBoxState {
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error';
}

export const defaultMessageBoxState: MessageBoxState = {
  title: 'Message box',
  message: 'Message',
  type: 'info',
};
