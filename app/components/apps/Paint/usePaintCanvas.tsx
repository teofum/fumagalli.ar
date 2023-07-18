import { useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import type { PaintEvent, PaintState, Rect } from './types';
import { brushes } from './brushes';
import usePaint from './usePaint';
import clear from './utils/clear';
import useMoveSelection from './useMoveSelection';
import useResizeSelection from './useResizeSelection';
import copyImageData from './utils/copyImageData';

export default function usePaintCanvas(
  state: PaintState,
  setState: (value: Partial<PaintState>) => void,
) {
  /**
   * State/refs
   */
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const scratchRef = useRef<any>({});
  const scratchCanvasRef = useRef<HTMLCanvasElement>(null);

  const selectionRef = useRef<HTMLDivElement>(null);
  const selectionCanvasRef = useRef<HTMLCanvasElement>(null);

  const brush = brushes[state.brush];

  const [fr, fg, fb] = state.fgColor;
  const [br, bg, bb] = state.bgColor;
  const fgColor = `rgb(${fr} ${fg} ${fb})`;
  const bgColor = `rgb(${br} ${bg} ${bb})`;

  const lastPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const canvasRef = (el: HTMLCanvasElement | null) => {
    setCanvas(el);
  };

  /**
   * Init/resize
   */
  useEffect(() => {
    const ctx = canvas?.getContext('2d');
    const scratchCtx = scratchCanvasRef.current?.getContext('2d');

    if (canvas && ctx && scratchCanvasRef.current && scratchCtx) {
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);

      canvas.width = state.canvasWidth;
      canvas.height = state.canvasHeight;

      scratchCanvasRef.current.width = state.canvasWidth;
      scratchCanvasRef.current.height = state.canvasHeight;

      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = false;

      // Restore image data if not empty
      if (data.data[3] !== 0) {
        ctx.putImageData(data, 0, 0);
      }
    }
  }, [canvas, state.canvasWidth, state.canvasHeight]);

  /**
   * Reset scratch data on brush change
   */
  useEffect(() => {
    const scratch = scratchRef.current;
    if (scratch) Object.keys(scratch).forEach((key) => delete scratch[key]);

    const scratchCanvas = scratchCanvasRef.current;
    const scratchCtx = scratchCanvas?.getContext('2d');
    if (scratchCanvas && scratchCtx) clear(scratchCtx);

    if (state.selection !== null) {
      deselect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.brush, state.brushVariant]);

  /**
   * Clear the main drawing canvas (new file)
   */
  const clearMainCanvas = () => {
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      clear(ctx);
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    const scratchCanvas = scratchCanvasRef.current;
    const scratchCtx = scratchCanvas?.getContext('2d');
    if (scratchCanvas && scratchCtx) clear(scratchCtx);
  };

  /**
   * Selection
   */
  function select({ x, y, w, h }: Rect, mask?: boolean) {
    deselect(); // Remove previous selection

    const ctx = canvas?.getContext('2d');
    const selectionCanvas = selectionCanvasRef.current;
    const selectionCtx = selectionCanvas?.getContext('2d');
    const scratchCanvas = scratchCanvasRef.current;
    const scratchCtx = scratchCanvas?.getContext('2d');
    if (canvas && ctx && selectionCanvas && selectionCtx && scratchCtx) {
      // Resize selection canvas
      selectionCanvas.width = w;
      selectionCanvas.height = h;

      // Copy from drawing canvas to selection
      copyImageData(ctx, x, y, w, h, selectionCtx, 0, 0, w, h, {
        mask: mask ? scratchCtx : null,
      });
      if (mask) clear(scratchCtx);

      setState({ selection: { x, y, w, h } });
    }
  }

  function deselect() {
    if (!state.selection) return;

    const ctx = canvas?.getContext('2d');
    const selectionCanvas = selectionCanvasRef.current;
    const selectionCtx = selectionCanvas?.getContext('2d');
    if (canvas && ctx && selectionCanvas && selectionCtx) {
      const { x, y, w, h } = state.selection;

      // Copy from selection to drawing canvas
      copyImageData(selectionCtx, 0, 0, w, h, ctx, x, y, w, h, {
        mask: selectionCtx,
      })
    }

    setState({ selection: null });
  }

  /**
   * Build a paint event from pointer ev
   */
  function getPaintEvent(ev: PointerEvent) {
    const ctx = canvas?.getContext('2d');
    const scratchCtx = scratchCanvasRef.current?.getContext('2d');
    const selectionCtx = selectionCanvasRef.current?.getContext('2d');

    if (
      canvas &&
      ctx &&
      scratchCanvasRef.current &&
      scratchCtx &&
      selectionCanvasRef.current &&
      selectionCtx
    ) {
      const canvasRect = canvas.getBoundingClientRect();
      const x = Math.round((ev.clientX - canvasRect.x) / state.zoom);
      const y = Math.round((ev.clientY - canvasRect.y) / state.zoom);

      const fromX = lastPos.current.x;
      const fromY = lastPos.current.y;

      lastPos.current = { x, y };

      const event: PaintEvent = {
        pointerEvent: ev,
        canvas,
        ctx,

        x,
        y,
        fromX,
        fromY,

        fg: fgColor,
        bg: bgColor,
        brushVariant: state.brushVariant,

        state,
        setState,

        scratch: scratchRef.current,
        scratchCanvas: scratchCanvasRef.current,
        scratchCtx,

        selection: state.selection,
        selectionCanvas: selectionCanvasRef.current,
        selectionCtx,
        select,
        deselect,
      };

      return event;
    }
  }

  /**
   * Paint event handlers
   */
  const onPaintStart = (ev: PointerEvent) => {
    const event = getPaintEvent(ev);
    if (event) brush.onPointerDown?.(event);
  };

  const onPaintMove = (ev: PointerEvent) => {
    const event = getPaintEvent(ev);
    if (event) brush.onPointerMove?.(event);
  };

  const onPaintEnd = (ev: PointerEvent) => {
    const event = getPaintEvent(ev);
    if (event) brush.onPointerUp?.(event);
  };

  const onPointerDown = usePaint({
    onPaintStart,
    onPaintMove,
    onPaintEnd,
  });

  const onContextMenu = (ev: React.MouseEvent) => ev.preventDefault();

  /**
   * Selection event handlers
   */

  // Aliases for the sake of keeping the following lines short
  const c = containerRef;
  const s = selectionRef;
  const sc = selectionCanvasRef;
  const moveHandler = useMoveSelection(c, s, state, setState);
  const resizeHandlerNW = useResizeSelection(c, s, sc, state, setState, 'nw');
  const resizeHandlerN = useResizeSelection(c, s, sc, state, setState, 'n');
  const resizeHandlerNE = useResizeSelection(c, s, sc, state, setState, 'ne');
  const resizeHandlerE = useResizeSelection(c, s, sc, state, setState, 'e');
  const resizeHandlerSE = useResizeSelection(c, s, sc, state, setState, 'se');
  const resizeHandlerS = useResizeSelection(c, s, sc, state, setState, 's');
  const resizeHandlerSW = useResizeSelection(c, s, sc, state, setState, 'sw');
  const resizeHandlerW = useResizeSelection(c, s, sc, state, setState, 'w');

  const resizeHandles = [
    <div
      key="nw"
      className="absolute w-1 h-1 bg-black cursor-nwse-resize bottom-full right-full"
      onPointerDown={resizeHandlerNW}
    />,
    <div
      key="n"
      className="absolute w-1 h-1 bg-black cursor-ns-resize bottom-full left-1/2 -translate-x-1/2"
      onPointerDown={resizeHandlerN}
    />,
    <div
      key="ne"
      className="absolute w-1 h-1 bg-black cursor-nesw-resize bottom-full left-full"
      onPointerDown={resizeHandlerNE}
    />,
    <div
      key="e"
      className="absolute w-1 h-1 bg-black cursor-ew-resize left-full top-1/2 -translate-y-1/2"
      onPointerDown={resizeHandlerE}
    />,
    <div
      key="se"
      className="absolute w-1 h-1 bg-black cursor-nwse-resize top-full left-full"
      onPointerDown={resizeHandlerSE}
    />,
    <div
      key="s"
      className="absolute w-1 h-1 bg-black cursor-ns-resize top-full left-1/2 -translate-x-1/2"
      onPointerDown={resizeHandlerS}
    />,
    <div
      key="sw"
      className="absolute w-1 h-1 bg-black cursor-nesw-resize top-full right-full"
      onPointerDown={resizeHandlerSW}
    />,
    <div
      key="w"
      className="absolute w-1 h-1 bg-black cursor-ew-resize right-full top-1/2 -translate-y-1/2"
      onPointerDown={resizeHandlerW}
    />,
  ];

  return {
    containerProps: {
      ref: containerRef,
    },
    canvasProps: {
      ref: canvasRef,
      onPointerDown,
      onContextMenu,
      className: '[image-rendering:pixelated]',
      style: {
        width: state.canvasWidth * state.zoom,
        height: state.canvasHeight * state.zoom,
      },
    },
    scratchCanvasProps: {
      ref: scratchCanvasRef,
      className:
        'absolute inset-0 [image-rendering:pixelated] pointer-events-none',
      style: {
        width: state.canvasWidth * state.zoom,
        height: state.canvasHeight * state.zoom,
      },
    },
    selectionContainerProps: {
      ref: selectionRef,
      className: cn('absolute cursor-move', {
        hidden: state.selection === null,
      }),
      style: {
        top: state.selection?.y,
        left: state.selection?.x,
        width: state.selection?.w,
        height: state.selection?.h,
      },
      onPointerDown: moveHandler,
    },
    selectionCanvasProps: {
      ref: selectionCanvasRef,
      className: 'absolute inset-0 w-full h-full [image-rendering:pixelated]',
    },
    clear: clearMainCanvas,
    resizeHandles,
    canvas,
  };
}
