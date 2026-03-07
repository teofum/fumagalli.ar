export interface HelpState {
  openId: string;
  history: string[];
  backCount: number;
}

export const defaultHelpState: HelpState = {
  openId: '69c76666-1610-4ff9-87d7-81956e1a12b5',
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
