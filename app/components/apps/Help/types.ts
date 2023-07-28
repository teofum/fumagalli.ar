export interface HelpState {
  path: string;
}

export const defaultHelpState: HelpState = {
  path: '/01.Welcome to Help.md',
};

export interface HelpSettings {
  sideBar: boolean;
}

export const defaultHelpSettings: HelpSettings = {
  sideBar: true,
}
