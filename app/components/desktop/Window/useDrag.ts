interface Handlers {
  onDragStart?: (ev: PointerEvent) => void;
  onDragMove?: (ev: PointerEvent) => void;
  onDragEnd?: (ev: PointerEvent) => void;
}

/**
 * Utility hook for draggable elements
 * @param onDragStart Event handler fired on drag start
 * @param onDragMove Event handler fired on pointer moved while dragging
 * @param onDragEnd Event handler fired on drag end (released)
 * @returns Pointer down event handler to pass to onPointerDown prop
 */
export default function useDrag({
  onDragStart,
  onDragMove,
  onDragEnd,
}: Handlers) {
  const drag = (ev: PointerEvent) => {
    onDragStart?.(ev);

    const dragMove = (ev: PointerEvent) => {
      ev.preventDefault();
      ev.stopPropagation();
      onDragMove?.(ev);
    };

    // At the end of a drag event (release)...
    const dragEnd = (ev: PointerEvent) => {
      if (ev.button !== 0) return;

      onDragEnd?.(ev);

      // Clean up event listeners
      window.removeEventListener('pointermove', dragMove);
      window.removeEventListener('pointerup', dragEnd);
    };

    window.addEventListener('pointermove', dragMove); // Drag while moving
    window.addEventListener('pointerup', dragEnd); // End drag on pointer up
  };

  const pointerDownHandler = (ev?: React.PointerEvent) => {
    if (ev && ev.button > 0) return;

    const start = (ev: PointerEvent) => {
      ev.preventDefault();
      ev.stopPropagation();
      drag(ev);
      cancel();
    };

    // Clean up event listeners
    const cancel = () => {
      window.removeEventListener('pointermove', start);
      window.removeEventListener('pointerup', cancel);
    };

    // On pointer down...
    window.addEventListener('pointermove', start); // Start dragging on move
    window.addEventListener('pointerup', cancel); // Cancel on pointer up (click)
  };

  return pointerDownHandler;
}
