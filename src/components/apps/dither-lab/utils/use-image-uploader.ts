import { createHash } from 'sha256-uint8array';

import { files } from '@/components/apps/files';
import { messageBox } from '@/components/apps/message-box';
import { useAppState, useWindow } from '@/components/desktop/Window/context';
import { useDitherLabImageStore } from '@/stores/dither-lab.store';

async function getImageSize(file: Blob) {
  const bmp = await createImageBitmap(file);
  const { width, height } = bmp;
  bmp.close();

  return { width, height };
}

export default function useImageUploader() {
  const { modal } = useWindow();
  const [state, update] = useAppState('dither');
  const imageStore = useDitherLabImageStore();

  const loadImageFromFile = async (
    filename: string,
    file: Blob,
    url: string | null = null,
  ) => {
    const { width, height } = await getImageSize(file);
    const data = new Uint8Array(await file.arrayBuffer());

    // Use a hash of the file contents to avoid conflicts if two files with
    // the same name are uploaded
    const hash = createHash().update(data).digest('hex');
    const imageId = url
      ? `url__${url.replace('/', '_')}`
      : `file__${filename}__${hash}`;

    if (!imageStore.items[imageId]) {
      imageStore.addImage(imageId, {
        meta: { filename, width, height, url },
        data,
      });
    }
    update({ image: imageId });
  };

  const loadImageFromURL = async (filename: string, url: string) => {
    const imageId = `url__${url.replace('/', '_')}`;
    if (imageStore.items[imageId]) {
      update({ image: imageId });
      return;
    }

    const res = await fetch(url);
    if (res.ok) {
      const data = await res.blob();
      await loadImageFromFile(filename, data, url);
    } else {
      const message = res.statusText;
      modal(
        messageBox({
          type: 'warning',
          title: "Can't open image",
          message: `An error ocurred while opening the image: ${message}`,
        }),
      );
    }
  };

  const uploadHandler = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const input = ev.target;
    if (input?.files) {
      const file = input.files[0];
      loadImageFromFile(file.name, file);
    }
  };

  const open = () => {
    modal(
      files({
        typeFilter: ['fileImage'],
        modalCallback: (stub) =>
          loadImageFromURL(stub.name, `/api/safeimage?id=${stub._id}`),
      }),
    );
  };

  return { uploadHandler, open };
}
