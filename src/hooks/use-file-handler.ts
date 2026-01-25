import { dosEmu } from '@/components/apps/DOSEmu';
import { DOS_GAMES } from '@/components/apps/DOSEmu/types';
import { preview } from '@/components/apps/Preview';
import { previewSupportedFileTypes } from '@/components/apps/Preview/types';
import { getApp } from '@/components/apps/renderApp';
import { AnyFile } from '@/schemas/file';
import type { ItemStub } from '@/schemas/folder';
import useDesktopStore from '@/stores/desktop';
import useSystemStore from '@/stores/system';

function isPreviewable(file: ItemStub) {
  return previewSupportedFileTypes.includes(
    file._type as (typeof previewSupportedFileTypes)[number],
  );
}

export default function useFileHandler() {
  const { launch } = useDesktopStore();
  const { saveFileToHistory } = useSystemStore();

  const open = (stub: ItemStub) => {
    let handled = false;

    if (isPreviewable(stub)) {
      launch(preview({ fileStub: stub }));
      handled = true;
    } else if (stub._type === 'fileApp') {
      const app = getApp(stub.name.split('.')[0]);
      if (app) {
        launch(app);
        handled = true;
      }
    } else if (stub._type === 'fileDos') {
      launch(
        dosEmu(
          DOS_GAMES.find(
            (game) =>
              game.title.toLowerCase().replace(' ', '_') ===
              stub.name.split('.')[0],
          ),
        ),
      );
    }

    if (handled) {
      saveFileToHistory({ time: Date.now(), item: stub as AnyFile });
    }

    return handled;
  };

  return { open };
}
