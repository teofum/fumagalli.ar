import useDrag from '@/hooks/use-drag';
import type { PaintState } from './types';

export default function useMoveSelection(
  containerRef: React.RefObject<HTMLDivElement | null>,
  selectionRef: React.RefObject<HTMLDivElement | null>,
  state: PaintState,
  setState: (value: Partial<PaintState>) => void,
) {
  const onDragStart = (ev: PointerEvent) => {
    const el = selectionRef.current;
    if (!el) return;

    // Calculate pointer offset from selection topmost corner
    const { x, y } = el.getBoundingClientRect();
    const offsetX = x - ev.clientX;
    const offsetY = y - ev.clientY;

    // Save offset to DOM data attributes temporarily
    el.dataset.offsetX = offsetX.toString();
    el.dataset.offsetY = offsetY.toString();
  };

  const onDragMove = (ev: PointerEvent) => {
    const el = selectionRef.current;
    const container = containerRef.current;
    if (!el || !container) return;

    // Calculate new selection position from cursor + offset
    const offsetX = Number(el.dataset.offsetX || '0');
    const offsetY = Number(el.dataset.offsetY || '0');
    const newX = ev.clientX + offsetX;
    const newY = ev.clientY + offsetY;

    const { x: cx, y: cy } = container.getBoundingClientRect();

    el.style.setProperty(
      'top',
      `${~~((newY - cy) / state.zoom) * state.zoom}px`,
    );
    el.style.setProperty(
      'left',
      `${~~((newX - cx) / state.zoom) * state.zoom}px`,
    );
  };

  const onDragEnd = () => {
    const el = selectionRef.current;
    const container = containerRef.current;
    if (!el || !container) return;

    // Reset offset data attributes
    delete el.dataset.offsetX;
    delete el.dataset.offsetY;

    // Commit changes to selection state
    const { x, y } = el.getBoundingClientRect();
    const { x: cx, y: cy } = container.getBoundingClientRect();

    if (state.selection !== null) {
      setState({
        selection: {
          ...state.selection,
          x: ~~((x - cx) / state.zoom),
          y: ~~((y - cy) / state.zoom),
        },
      });
    }
  };

  return useDrag({
    onDragStart,
    onDragMove,
    onDragEnd,
  });
}
