export interface HelpState {
  path: string;
  history: string[];
  backCount: number;
}

export const defaultHelpState: HelpState = {
  path: '/01.Welcome to Help.md',
  history: [],
  backCount: 0,
};

export interface HelpSettings {
  sideBar: boolean;
  buttons: 'large' | 'icon';
}

export const defaultHelpSettings: HelpSettings = {
  sideBar: true,
  buttons: 'large',
}
