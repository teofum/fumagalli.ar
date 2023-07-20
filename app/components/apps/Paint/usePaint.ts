interface Handlers {
  onPaintStart?: (ev: PointerEvent, target: EventTarget | null) => void;
  onPaintMove?: (ev: PointerEvent, target: EventTarget | null) => void;
  onPaintEnd?: (ev: PointerEvent, target: EventTarget | null) => void;
}

export default function usePaint({
  onPaintStart,
  onPaintMove,
  onPaintEnd,
}: Handlers) {
  const paint = (ev: PointerEvent, target: EventTarget | null) => {
    onPaintStart?.(ev, target);

    const paintMove = (ev: PointerEvent) => {
      ev.preventDefault();
      ev.stopPropagation();
      onPaintMove?.(ev, target);
    };

    // At the end of a paint event (release)...
    const paintEnd = (ev: PointerEvent) => {
      if (ev.button !== 0 && ev.button !== 2) return;

      onPaintEnd?.(ev, target);

      // Clean up event listeners
      document.body.removeEventListener('pointermove', paintMove);
      document.body.removeEventListener('pointerup', paintEnd);
    };

    document.body.addEventListener('pointermove', paintMove); // Paint while moving
    document.body.addEventListener('pointerup', paintEnd); // End paint on pointer up
  };

  const pointerDownHandler = (ev?: React.PointerEvent) => {
    if (!ev || (ev.button !== 0 && ev.button !== 2)) return;

    const { target } = ev;

    ev.preventDefault();
    ev.stopPropagation();
    paint(ev.nativeEvent, target);
  };

  return pointerDownHandler;
}
