import { useDesktop } from '../Desktop/context';
import type { WindowProps } from './Window';
import useDrag from './useDrag';

// Utility
function clamp(value: number, min?: number, max?: number) {
  return Math.min(
    Math.max(value, min ?? Number.MIN_VALUE),
    max ?? Number.MAX_VALUE,
  );
}

export default function useResizeWindow(
  { id, minWidth, minHeight, maxWidth, maxHeight }: WindowProps,
  windowRef: React.RefObject<HTMLDivElement>,
  direction: 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw',
) {
  const desktop = useDesktop();

  const onDragStart = (ev: PointerEvent) => {
    const el = windowRef.current;
    if (!el) return;

    // Save starting window position and size to DOM data attributes temporarily
    const { x, y, width, height } = el.getBoundingClientRect();
    el.dataset.windowX = x.toString();
    el.dataset.windowY = y.toString();
    el.dataset.windowWidth = width.toString();
    el.dataset.windowHeight = height.toString();

    // Save pointer start position to DOM data attributes temporarily
    el.dataset.initialX = ev.clientX.toString();
    el.dataset.initialY = ev.clientY.toString();
  };

  const onDragMove = (ev: PointerEvent) => {
    const el = windowRef.current;
    if (!el) return;

    // Calculate cursor delta
    const initialX = Number(el.dataset.initialX || '0');
    const initialY = Number(el.dataset.initialY || '0');
    const deltaX = ev.clientX - initialX;
    const deltaY = ev.clientY - initialY;

    // Horizontal resizing
    if (direction.includes('e')) {
      const windowWidth = Number(el.dataset.windowWidth || '0');
      const newWidth = clamp(windowWidth + deltaX, minWidth, maxWidth);

      el.style.setProperty('width', `${~~newWidth}px`);
    } else if (direction.includes('w')) {
      const windowWidth = Number(el.dataset.windowWidth || '0');
      const newWidth = clamp(windowWidth - deltaX, minWidth, maxWidth);
      
      const windowX = Number(el.dataset.windowX || '0');
      const maxDeltaX = windowWidth - minWidth;
      const minDeltaX = windowWidth - (maxWidth ?? Number.MAX_VALUE);
      const newX = windowX + clamp(deltaX, minDeltaX, maxDeltaX);

      el.style.setProperty('width', `${~~newWidth}px`);
      el.style.setProperty('left', `${~~newX}px`);
    }

    // Vertical resizing
    if (direction.includes('s')) {
      const windowHeight = Number(el.dataset.windowHeight || '0');
      const newHeight = clamp(windowHeight + deltaY, minHeight, maxHeight);

      el.style.setProperty('height', `${~~newHeight}px`);
    } else if (direction.includes('n')) {
      const windowHeight = Number(el.dataset.windowHeight || '0');
      const newHeight = clamp(windowHeight - deltaY, minHeight, maxHeight);
      
      const windowY = Number(el.dataset.windowY || '0');
      const maxDeltaY = windowHeight - minHeight;
      const minDeltaY = windowHeight - (maxHeight ?? Number.MAX_VALUE);
      const newY = windowY + clamp(deltaY, minDeltaY, maxDeltaY);

      el.style.setProperty('height', `${~~newHeight}px`);
      el.style.setProperty('top', `${~~newY}px`);
    }
  };

  const onDragEnd = (ev: PointerEvent) => {
    const el = windowRef.current;
    if (!el) return;

    // Reset offset data attributes
    delete el.dataset.initialX;
    delete el.dataset.initialY;
    delete el.dataset.windowX;
    delete el.dataset.windowY;
    delete el.dataset.windowWidth;
    delete el.dataset.windowHeight;

    // Commit window changes to application state
    const { top, left, width, height } = el.getBoundingClientRect();
    desktop.dispatch({
      type: 'moveAndResize',
      id,
      data: {
        top,
        left,
        width,
        height,
      },
    });
  };

  return useDrag({
    onDragStart,
    onDragMove,
    onDragEnd,
  });
}
