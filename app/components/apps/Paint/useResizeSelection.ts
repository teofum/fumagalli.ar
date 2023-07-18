import useDrag from '~/hooks/useDrag';
import clamp from '~/utils/clamp';
import type { PaintState } from './types';
import getPixelData from './utils/getPixelData';

export default function useResizeSelection(
  containerRef: React.RefObject<HTMLDivElement>,
  selectionRef: React.RefObject<HTMLDivElement>,
  selectionCanvasRef: React.RefObject<HTMLCanvasElement>,
  state: PaintState,
  setState: (value: Partial<PaintState>) => void,
  direction: 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw',
) {
  const onDragStart = (ev: PointerEvent) => {
    const el = selectionRef.current;
    if (!el) return;

    // Save pointer start position to DOM data attributes temporarily
    el.dataset.initialX = ev.clientX.toString();
    el.dataset.initialY = ev.clientY.toString();
  };

  const onDragMove = (ev: PointerEvent) => {
    const el = selectionRef.current;
    if (!el || !state.selection) return;

    // Calculate cursor delta
    const initialX = Number(el.dataset.initialX || '0');
    const initialY = Number(el.dataset.initialY || '0');
    const deltaX = ev.clientX - initialX;
    const deltaY = ev.clientY - initialY;

    const { x, y, w, h } = state.selection;

    // Horizontal resizing
    if (direction.includes('e')) {
      const newWidth = clamp(w + deltaX, 1);

      el.style.setProperty('width', `${~~newWidth}px`);
    } else if (direction.includes('w')) {
      const newWidth = clamp(w - deltaX, 1);

      const maxDeltaX = w - 1;
      const newX = x + clamp(deltaX, -Number.MAX_VALUE, maxDeltaX);

      el.style.setProperty('width', `${~~newWidth}px`);
      el.style.setProperty('left', `${~~newX}px`);
    }

    // Vertical resizing
    if (direction.includes('s')) {
      const newHeight = clamp(h + deltaY, 1);

      el.style.setProperty('height', `${~~newHeight}px`);
    } else if (direction.includes('n')) {
      const newHeight = clamp(h - deltaY, 1);

      const maxDeltaY = h - 1;
      const newY = y + clamp(deltaY, -Number.MAX_VALUE, maxDeltaY);

      el.style.setProperty('height', `${~~newHeight}px`);
      el.style.setProperty('top', `${~~newY}px`);
    }
  };

  const onDragEnd = (ev: PointerEvent) => {
    const el = selectionRef.current;
    const container = containerRef.current;
    if (!el || !container) return;

    // Reset offset data attributes
    delete el.dataset.initialX;
    delete el.dataset.initialY;
    delete el.dataset.windowX;
    delete el.dataset.windowY;
    delete el.dataset.windowWidth;
    delete el.dataset.windowHeight;

    // Commit changes to selection state
    const { x, y, width: w, height: h } = el.getBoundingClientRect();
    const { x: cx, y: cy } = container.getBoundingClientRect();

    setState({
      selection: { x: ~~(x - cx), y: ~~(y - cy), w, h },
    });

    // Resize selection
    const selectionCanvas = selectionCanvasRef.current;
    const selectionCtx = selectionCanvas?.getContext('2d');
    if (selectionCanvas && selectionCtx) {
      const imageData = selectionCtx.getImageData(
        0,
        0,
        selectionCanvas.width,
        selectionCanvas.height,
      );
      const pixelData = getPixelData(imageData);

      const newImageData = selectionCtx.createImageData(w, h);
      const newPixelData = getPixelData(newImageData);

      // Copy image data using nearest-neighbor sampling
      // for squishy, pixelated goodness
      for (let i = 0; i < newPixelData.data.length; i++) {
        const x = i % newPixelData.width;
        const y = ~~(i / newPixelData.width);

        const oldX = ~~((x * pixelData.width) / newPixelData.width);
        const oldY = ~~((y * pixelData.height) / newPixelData.height);
        const oldI = oldY * pixelData.width + oldX;

        newPixelData.data[i] = pixelData.data[oldI];
      }

      selectionCanvas.width = w;
      selectionCanvas.height = h;
      selectionCtx.putImageData(newImageData, 0, 0);
    }
  };

  const dragHandler = useDrag({
    onDragStart,
    onDragMove,
    onDragEnd,
  });

  return (ev: React.PointerEvent) => {
    ev.stopPropagation();
    dragHandler(ev);
  };
}
