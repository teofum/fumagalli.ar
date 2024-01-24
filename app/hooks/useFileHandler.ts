// import { dosEmu } from '~/components/apps/DOSEmu';
import { preview } from '~/components/apps/Preview';
import {
  type PreviewSupportedFile,
  previewSupportedFileTypes,
} from '~/components/apps/Preview/types';
import { getApp } from '~/components/apps/renderApp';
import type { AnyFile } from '~/schemas/file';
import useDesktopStore from '~/stores/desktop';
import useSystemStore from '~/stores/system';

function isPreviewable(file: AnyFile): file is PreviewSupportedFile {
  return previewSupportedFileTypes.includes(file._type);
}

export default function useFileHandler() {
  const { launch } = useDesktopStore();
  const { saveFileToHistory } = useSystemStore();

  const open = (file: AnyFile) => {
    let handled = false;

    if (isPreviewable(file)) {
      launch(preview({ file }));
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

    if (handled && file._type !== 'app') {
      saveFileToHistory({ time: Date.now(), item: file });
    }

    return handled;
  };

  return { open };
}
