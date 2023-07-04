import useDesktopStore from '~/stores/desktop';
import type { AnyWindowProps } from './Window';
import useDrag from '~/hooks/useDrag';

export default function useMoveWindow(
  { id, parentId }: AnyWindowProps,
  windowRef: React.RefObject<HTMLDivElement>,
) {
  const { moveAndResize } = useDesktopStore();

  const onDragStart = (ev: PointerEvent) => {
    const el = windowRef.current;
    if (!el) return;

    // Calculate pointer offset from window topmost corner
    const { x, y } = el.getBoundingClientRect();
    const offsetX = x - ev.clientX;
    const offsetY = y - ev.clientY;

    // Save offset to DOM data attributes temporarily
    el.dataset.offsetX = offsetX.toString();
    el.dataset.offsetY = offsetY.toString();
  };

  const onDragMove = (ev: PointerEvent) => {
    const el = windowRef.current;
    if (!el) return;

    // Calculate new window position from cursor + offset
    const offsetX = Number(el.dataset.offsetX || '0');
    const offsetY = Number(el.dataset.offsetY || '0');
    const newX = ev.clientX + offsetX;
    const newY = ev.clientY + offsetY;

    el.style.setProperty('top', `${~~newY}px`);
    el.style.setProperty('left', `${~~newX}px`);
  };

  const onDragEnd = () => {
    const el = windowRef.current;
    if (!el) return;

    // Reset offset data attributes
    delete el.dataset.offsetX;
    delete el.dataset.offsetY;

    // Commit window changes to application state
    const { top, left, width, height } = el.getBoundingClientRect();
    moveAndResize(
      id,
      {
        top,
        left,
        width,
        height,
      },
      parentId,
    );
  };

  return useDrag({
    onDragStart,
    onDragMove,
    onDragEnd,
  });
}
