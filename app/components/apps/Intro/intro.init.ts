import { WindowSizingMode, type WindowInit } from '~/components/desktop/Window';
import { ApplicationType } from '../renderApp';

export const intro: WindowInit = {
  appType: ApplicationType.INTRO,

  title: 'About me',
  icon: 'man-with-hat',

  width: 640,

  sizingX: WindowSizingMode.FIXED,
  sizingY: WindowSizingMode.AUTO,

  maximizable: false,
};
