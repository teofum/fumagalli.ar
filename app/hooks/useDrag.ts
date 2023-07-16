interface Handlers {
  onDragStart?: (ev: PointerEvent, target: EventTarget | null) => void;
  onDragMove?: (ev: PointerEvent, target: EventTarget | null) => void;
  onDragEnd?: (ev: PointerEvent, target: EventTarget | null) => void;
}

interface DragOptions {
  allowSecondaryButton: boolean;
}

/**
 * Utility hook for draggable elements
 * @param onDragStart Event handler fired on drag start
 * @param onDragMove Event handler fired on pointer moved while dragging
 * @param onDragEnd Event handler fired on drag end (released)
 * @returns Pointer down event handler to pass to onPointerDown prop
 */
export default function useDrag(
  { onDragStart, onDragMove, onDragEnd }: Handlers,
  options?: DragOptions,
) {
  const drag = (ev: PointerEvent, target: EventTarget | null) => {
    onDragStart?.(ev, target);

    const dragMove = (ev: PointerEvent) => {
      ev.preventDefault();
      ev.stopPropagation();
      onDragMove?.(ev, target);
    };

    // At the end of a drag event (release)...
    const dragEnd = (ev: PointerEvent) => {
      if (
        ev.button !== 0 &&
        (ev.button !== 2 || !options?.allowSecondaryButton)
      )
        return;

      onDragEnd?.(ev, target);

      // Clean up event listeners
      document.body.removeEventListener('pointermove', dragMove);
      document.body.removeEventListener('pointerup', dragEnd);
    };

    document.body.addEventListener('pointermove', dragMove); // Drag while moving
    document.body.addEventListener('pointerup', dragEnd); // End drag on pointer up
  };

  const pointerDownHandler = (ev?: React.PointerEvent) => {
    if (
      ev &&
      ev.button !== 0 &&
      (ev.button !== 2 || !options?.allowSecondaryButton)
    )
      return;

    const start = (ev: PointerEvent) => {
      const { target } = ev;

      ev.preventDefault();
      ev.stopPropagation();
      drag(ev, target);
      cancel();
    };

    // Clean up event listeners
    const cancel = () => {
      document.body.removeEventListener('pointermove', start);
      document.body.removeEventListener('pointerup', cancel);
    };

    // On pointer down...
    document.body.addEventListener('pointermove', start); // Start dragging on move
    document.body.addEventListener('pointerup', cancel); // Cancel on pointer up (click)
  };

  return pointerDownHandler;
}
