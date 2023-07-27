import Menu from '~/components/ui/Menu';
import { usePaintContext } from '../context';

export default function PaintEditMenu() {
  const { state, setState, pasteIntoSelection, selectionCanvas, select } =
    usePaintContext();

  /**
   * History
   */
  const canUndo = state.history.length > state.undoCount + 1;
  const undo = () => {
    const ctx = state.canvas?.getContext('2d');
    if (!ctx || !canUndo) return;

    const restored = state.history.at(state.undoCount + 1);
    if (restored) {
      ctx.putImageData(restored, 0, 0);
      setState({ undoCount: state.undoCount + 1, selection: null });
    }
  };

  const canRedo = state.undoCount > 0;
  const redo = () => {
    const ctx = state.canvas?.getContext('2d');
    if (!ctx || !canRedo) return;

    const restored = state.history.at(state.undoCount - 1);
    if (restored) {
      ctx.putImageData(restored, 0, 0);
      setState({ undoCount: state.undoCount - 1, selection: null });
    }
  };

  /**
   * Selection
   */
  const clearSelection = () => {
    const ctx = state.canvas?.getContext('2d');
    if (ctx && state.selection) {
      const { x, y, w, h } = state.selection;
      const [br, bg, bb] = state.bgColor;
      ctx.fillStyle = `rgb(${br} ${bg} ${bb})`;
      ctx.fillRect(x, y, w, h);

      setState({ selection: null });
    }
  };

  const selectAll = () => {
    select({ x: 0, y: 0, w: state.canvasWidth, h: state.canvasHeight });
    const ctx = state.canvas?.getContext('2d');
    if (ctx) {
      const [br, bg, bb] = state.bgColor;
      ctx.fillStyle = `rgb(${br} ${bg} ${bb})`;
      ctx.fillRect(0, 0, state.canvasWidth, state.canvasHeight);
    }
  };

  /**
   * Clipboard
   */
  const copy = () => {
    selectionCanvas?.toBlob((blob) => {
      if (!blob) return;

      const clip = new ClipboardItem({
        'image/png': blob,
      });
      navigator.clipboard.write([clip]);
    }, 'image/png');
  };

  const cut = () => {
    copy();
    clearSelection();
  };

  const paste = async () => {
    const clip = await navigator.clipboard.read();

    const item = clip.find((item) => item.types.includes('image/png'));
    const blob = await item?.getType('image/png');

    if (!blob) return;

    const img = new Image();
    img.addEventListener(
      'load',
      () => {
        const temp = document.createElement('canvas');
        const tempCtx = temp.getContext('2d');

        if (tempCtx) {
          temp.width = img.naturalWidth;
          temp.height = img.naturalHeight;
          tempCtx.drawImage(img, 0, 0);

          const imageData = tempCtx.getImageData(0, 0, temp.width, temp.height);
          pasteIntoSelection(imageData);
        }
      },
      { once: true },
    );

    img.src = URL.createObjectURL(blob);
  };

  return (
    <Menu.Menu trigger={<Menu.Trigger>Edit</Menu.Trigger>}>
      <Menu.Item label="Undo" onSelect={undo} disabled={!canUndo} />
      <Menu.Item label="Redo" onSelect={redo} disabled={!canRedo} />

      <Menu.Separator />

      <Menu.Item
        label="Cut"
        onSelect={cut}
        disabled={state.selection === null || !navigator.clipboard}
      />
      <Menu.Item
        label="Copy"
        onSelect={copy}
        disabled={state.selection === null || !navigator.clipboard}
      />
      <Menu.Item
        label="Paste"
        onSelect={paste}
        disabled={!navigator.clipboard}
      />
      <Menu.Item
        label="Clear Selection"
        onSelect={clearSelection}
        disabled={state.selection === null}
      />
      <Menu.Item label="Select All" onSelect={selectAll} />
    </Menu.Menu>
  );
}
