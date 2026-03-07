export interface DOSEmuState {
  bundleUrl: string;
  title: string;
}

export const defaultDOSEmuState: DOSEmuState = {
  bundleUrl: '',
  title: '',
};

export const DOS_GAMES: DOSEmuState[] = [
  { title: 'DOOM', bundleUrl: '/fs/Applications/dos/games/doom.jsdos' },
  {
    title: 'Stunts',
    bundleUrl: '/fs/Applications/dos/games/stunts.jsdos',
  },
];
