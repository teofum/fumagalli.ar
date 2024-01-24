// import { dosEmu } from '~/components/apps/DOSEmu';
import { preview } from '~/components/apps/Preview';
import { previewSupportedFileTypes } from '~/components/apps/Preview/types';
// import { getApp } from '~/components/apps/renderApp';
import type { ItemStub } from '~/schemas/folder';
import useDesktopStore from '~/stores/desktop';
import useSystemStore from '~/stores/system';

function isPreviewable(file: ItemStub) {
  return previewSupportedFileTypes.includes(file._type as any);
}

export default function useFileHandler() {
  const { launch } = useDesktopStore();
  const { saveFileToHistory } = useSystemStore();

  const open = (stub: ItemStub) => {
    let handled = false;

    if (isPreviewable(stub)) {
      launch(preview({ fileStub: stub }));
      handled = true;
    }
    // else if (file._type === 'app') {
    //   const app = getApp(file.name.split('.')[0]);
    //   if (app) {
    //     launch(app);
    //     handled = true;
    //   }
    // } else if (file._type === 'dos') {
    //   // TODO restore DOS ROM files
    //   // launch(dosEmu({ bundleUrl: `/fs${path}` }));
    // }

    if (handled) {
      saveFileToHistory({ time: Date.now(), item: stub });
    }

    return handled;
  };

  return { open };
}
