import { useEffect, useRef } from 'react';
import cn from 'classnames';

import type { PaintEvent, PaintState, Rect } from './types';
import { brushes } from './brushes';
import usePaint from './usePaint';
import clear from './utils/clear';
import useMoveSelection from './useMoveSelection';
import useResizeSelection from './useResizeSelection';
import copyImageData from './utils/copyImageData';
import invertColors from './utils/invertColors';
import rotateInPlace from './utils/rotateInPlace';

const MAX_HISTORY = 5;

export default function usePaintCanvas(
  state: PaintState,
  setState: (value: Partial<PaintState>) => void,
) {
  /**
   * State/refs
   */
  const { canvas } = state;

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
    if (!state.canvas && el) setState({ canvas: el });
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

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setState({ history: [imageData], undoCount: 0, selection: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        mask: mask ? scratchCtx : undefined,
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
      });
    }

    updateHistory();
  }

  function pasteIntoSelection(data: ImageData) {
    deselect(); // Remove previous selection

    const selectionCanvas = selectionCanvasRef.current;
    const selectionCtx = selectionCanvas?.getContext('2d');
    if (selectionCanvas && selectionCtx) {
      // Resize selection canvas
      selectionCanvas.width = data.width;
      selectionCanvas.height = data.height;

      selectionCtx.putImageData(data, 0, 0);

      setState({ selection: { x: 0, y: 0, w: data.width, h: data.height } });
    }
  }

  /**
   * History
   */
  function updateHistory() {
    // Save current canvas state to history
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const history = [
        imageData,
        ...state.history.slice(state.undoCount), // Drop anything newer than the last undo
      ].slice(0, MAX_HISTORY); // Limit # of history items

      setState({ history, undoCount: 0, selection: null });
    }
  }

  /**
   * Image methods
   */
  function invert() {
    const ctx = canvas?.getContext('2d');
    const selectionCtx = selectionCanvasRef.current?.getContext('2d');

    if (state.selection && selectionCtx) invertColors(selectionCtx);
    else if (ctx) invertColors(ctx);
  }

  function flip(mode: 'horizontal' | 'vertical' | 'both') {
    const ctx = canvas?.getContext('2d');
    const selectionCtx = selectionCanvasRef.current?.getContext('2d');

    if (state.selection && selectionCtx) {
      const { w, h } = state.selection;
      copyImageData(selectionCtx, 0, 0, w, h, selectionCtx, 0, 0, w, h, {
        flip: mode,
      });
    } else if (canvas && ctx) {
      const { width, height } = canvas;
      copyImageData(ctx, 0, 0, width, height, ctx, 0, 0, width, height, {
        flip: mode,
      });
    }
  }

  function rotate(mode: 'cw' | 'ccw') {
    const ctx = canvas?.getContext('2d');
    const selectionCtx = selectionCanvasRef.current?.getContext('2d');

    if (state.selection && selectionCtx) {
      const { x, y, w, h } = state.selection;
      const halfW = Math.floor(w / 2);
      const halfH = Math.floor(h / 2);
      const cx = x + halfW;
      const cy = y + halfH;
      rotateInPlace(selectionCtx, mode);
      setState({ selection: { x: cx - halfH, y: cy - halfW, w: h, h: w } });
    } else if (ctx) {
      const rotated = rotateInPlace(ctx, mode);
      setState({
        canvasWidth: state.canvasHeight,
        canvasHeight: state.canvasWidth,
      });
      setTimeout(() => ctx.putImageData(rotated, 0, 0), 0);
    }
  }

  function stretchAndSkew(
    width: number,
    height: number,
    stretchMode: 'percent' | 'pixels',
    skewX: number,
    skewY: number,
  ) {
    console.log('stretchAndSkew', width, height);

    const ctx = canvas?.getContext('2d');
    const sctx = selectionCanvasRef.current?.getContext('2d');
    if (state.selection && sctx) {
      const { x, y, w, h } = state.selection;
      const nw = (w * width) / 100;
      const nh = (h * height) / 100;

      const transformed = copyImageData(sctx, 0, 0, w, h, sctx, 0, 0, nw, nh, {
        skewX,
        skewY,
        dstAutoSize: 'always',
      });

      setState({
        selection: { x, y, w: transformed.width, h: transformed.height },
      });
    } else if (canvas && ctx) {
      const { width: w, height: h } = canvas;
      const nw = (w * width) / 100;
      const nh = (h * height) / 100;

      const [r, g, b] = state.bgColor;
      const bgColor = 255 * 16777216 + b * 65536 + g * 256 + r;
      const transformed = copyImageData(ctx, 0, 0, w, h, ctx, 0, 0, nw, nh, {
        skewX,
        skewY,
        bgColor,
      });

      setState({
        canvasWidth: transformed.width,
        canvasHeight: transformed.height,
      });
      setTimeout(() => ctx.putImageData(transformed, 0, 0), 0);
    }
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

        updateHistory,
      };

      return event;
    }
  }

  /**
   * Paint event handlers
   */
  const onPaintStart = (ev: PointerEvent) => {
    if (state.selection !== null && !state.brush.includes('select')) deselect();

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

  const onContextMenu = (ev: React.MouseEvent) => {
    // Allow context menu only when using selection tools
    if (!state.brush.includes('select')) ev.preventDefault();
  };

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
      className="absolute w-1 h-1 bg-white border border-black cursor-nwse-resize bottom-full right-full"
      onPointerDown={resizeHandlerNW}
    />,
    <div
      key="n"
      className="absolute w-1 h-1 bg-white border border-black cursor-ns-resize bottom-full left-1/2 -translate-x-1/2"
      onPointerDown={resizeHandlerN}
    />,
    <div
      key="ne"
      className="absolute w-1 h-1 bg-white border border-black cursor-nesw-resize bottom-full left-full"
      onPointerDown={resizeHandlerNE}
    />,
    <div
      key="e"
      className="absolute w-1 h-1 bg-white border border-black cursor-ew-resize left-full top-1/2 -translate-y-1/2"
      onPointerDown={resizeHandlerE}
    />,
    <div
      key="se"
      className="absolute w-1 h-1 bg-white border border-black cursor-nwse-resize top-full left-full"
      onPointerDown={resizeHandlerSE}
    />,
    <div
      key="s"
      className="absolute w-1 h-1 bg-white border border-black cursor-ns-resize top-full left-1/2 -translate-x-1/2"
      onPointerDown={resizeHandlerS}
    />,
    <div
      key="sw"
      className="absolute w-1 h-1 bg-white border border-black cursor-nesw-resize top-full right-full"
      onPointerDown={resizeHandlerSW}
    />,
    <div
      key="w"
      className="absolute w-1 h-1 bg-white border border-black cursor-ew-resize right-full top-1/2 -translate-y-1/2"
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
        top: (state.selection?.y ?? 0) * state.zoom,
        left: (state.selection?.x ?? 0) * state.zoom,
        width: (state.selection?.w ?? 0) * state.zoom,
        height: (state.selection?.h ?? 0) * state.zoom,
      },
      onPointerDown: moveHandler,
    },
    selectionCanvasProps: {
      ref: selectionCanvasRef,
      className: 'absolute inset-0 w-full h-full [image-rendering:pixelated]',
    },
    clear: clearMainCanvas,
    select,
    deselect,
    pasteIntoSelection,
    invert,
    flip,
    rotate,
    stretchAndSkew,
    selectionCanvas: selectionCanvasRef.current,
    resizeHandles,
  };
}
