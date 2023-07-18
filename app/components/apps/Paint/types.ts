import type { brushes } from './brushes';

export interface Rect { x: number; y: number; w: number; h: number }

export interface PaintEvent {
  pointerEvent: PointerEvent;

  x: number;
  y: number;
  fromX: number;
  fromY: number;

  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  fg: string;
  bg: string;
  brushVariant: number;

  state: PaintState;
  setState: (state: Partial<PaintState>) => void;

  scratch: any;
  scratchCanvas: HTMLCanvasElement;
  scratchCtx: CanvasRenderingContext2D;

  selection: Rect | null;
  selectionCanvas: HTMLCanvasElement;
  selectionCtx: CanvasRenderingContext2D;
  select: (selectionRect: Rect, mask?: boolean) => void;
  deselect: () => void;
}

export interface PaintBrush {
  name: string;

  onPointerDown?: (ev: PaintEvent) => void;
  onPointerMove?: (ev: PaintEvent) => void;
  onPointerUp?: (ev: PaintEvent) => void;
}

export type PaintBrushFn = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
) => void;

export type PaintShapeFn = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  mode: 'fill' | 'stroke',
) => void;

export interface PaintState {
  brush: keyof typeof brushes;
  brushVariant: number;

  fgColor: number[];
  bgColor: number[];

  zoom: number;
  canvasWidth: number;
  canvasHeight: number;

  selection: Rect | null;
}

export const defaultPaintState: PaintState = {
  brush: 'pencil',
  brushVariant: 0,

  fgColor: [0, 0, 0],
  bgColor: [255, 255, 255],

  zoom: 1,
  canvasWidth: 600,
  canvasHeight: 400,

  selection: null,
};
