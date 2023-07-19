import ContextMenu from '~/components/ui/ContextMenu';
import { usePaintContext } from '../context';
import { paint_stretchAndSkew } from '../modals/StretchAndSkew';
import { useWindow } from '~/components/desktop/Window/context';

export default function PaintContextMenu() {
  const { modal } = useWindow();
  const {
    state,
    setState,
    pasteIntoSelection,
    selectionCanvas,
    select,
    invert,
    flip,
    rotate,
    stretchAndSkew,
  } = usePaintContext();

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
    <>
      <ContextMenu.Sub label="Flip/Rotate">
        <ContextMenu.Item
          label="Flip Horizontal"
          onSelect={() => flip('horizontal')}
        />
        <ContextMenu.Item
          label="Flip Vertical"
          onSelect={() => flip('vertical')}
        />

        <ContextMenu.Separator />

        <ContextMenu.Item label="Rotate 90°" onSelect={() => rotate('cw')} />
        <ContextMenu.Item label="Rotate 180°" onSelect={() => flip('both')} />
        <ContextMenu.Item label="Rotate 270°" onSelect={() => rotate('ccw')} />
      </ContextMenu.Sub>
      <ContextMenu.Item
        label="Stretch/Skew..."
        onSelect={() =>
          modal(
            paint_stretchAndSkew({
              commit: (...args) => stretchAndSkew(...args),
            }),
          )
        }
      />
      <ContextMenu.Item label="Invert Colors" onSelect={invert} />

      <ContextMenu.Separator />

      <ContextMenu.Item
        label="Cut"
        onSelect={cut}
        disabled={state.selection === null}
      />
      <ContextMenu.Item
        label="Copy"
        onSelect={copy}
        disabled={state.selection === null}
      />
      <ContextMenu.Item label="Paste" onSelect={paste} />
      <ContextMenu.Item
        label="Clear Selection"
        onSelect={clearSelection}
        disabled={state.selection === null}
      />
      <ContextMenu.Item label="Select All" onSelect={selectAll} />
    </>
  );
}
