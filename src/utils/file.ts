export function openFile(acceptTypes: string[]) {
  return new Promise<File | null>((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = acceptTypes.join(', ');

    input.addEventListener('change', (ev) => {
      const { files } = ev.target as HTMLInputElement;
      resolve(files?.[0] ?? null);
    });

    input.click();
  });
}

type SaveFileOptions = {
  suggestedName: string;
  types: SaveFilePickerOptions['types'];
  data: FileSystemWriteChunkType;
};

export async function openFileForWriting(
  options: Omit<SaveFileOptions, 'data'>,
) {
  try {
    const handle = await window.showSaveFilePicker(options);
    return await handle.createWritable();
  } catch {
    // TODO handle actual errors
    // By far the most common cause of throwing will be the user clicking cancel
    return null;
  }
}

export async function saveFile(options: SaveFileOptions) {
  try {
    const writable = await openFileForWriting(options);
    if (!writable) return false;

    await writable.write(options.data);
    await writable.close();
    return true;
  } catch {
    // TODO handle actual errors
    return false;
  }
}
