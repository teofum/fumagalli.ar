import type { WindowInit } from '~/components/desktop/Window';

export const paint: WindowInit<'paint'> = ({
  appType: 'paint',
  appState: undefined,

  title: 'Paint',

  minWidth: 300,
  minHeight: 400,

  width: 700,
  height: 560,
});
