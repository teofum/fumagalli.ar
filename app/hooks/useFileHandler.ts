import { dosEmu } from '~/components/apps/DOSEmu';
import { preview } from '~/components/apps/Preview';
import {
  type PreviewSupportedFile,
  previewSupportedFileTypes,
} from '~/components/apps/Preview/types';
import { getApp } from '~/components/apps/renderApp';
import type { AnyFile } from '~/content/types';
import useDesktopStore from '~/stores/desktop';
import useSystemStore from '~/stores/system';

function isPreviewable(file: AnyFile): file is PreviewSupportedFile {
  return previewSupportedFileTypes.includes(file.type);
}

export default function useFileHandler() {
  const { launch } = useDesktopStore();
  const { saveFileToHistory } = useSystemStore();

  const open = (file: AnyFile, path: string) => {
    let handled = false;

    if (isPreviewable(file)) {
      launch(preview({ file, filePath: path }));
      handled = true;
    } else if (file.type === 'app') {
      const app = getApp(file.name.split('.')[0]);
      if (app) {
        launch(app);
        handled = true;
      }
    } else if (file.type === 'dos') {
      launch(dosEmu({ bundleUrl: `/fs${path}` }));
    }

    if (handled && file.type !== 'app') {
      saveFileToHistory({ time: Date.now(), path, item: file });
    }

    return handled;
  };

  return { open };
}
