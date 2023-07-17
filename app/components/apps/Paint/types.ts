import type { brushes } from './brushes';

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
}

export interface PaintBrush {
  name: string;

  onPointerDown: (ev: PaintEvent) => void;
  onPointerMove: (ev: PaintEvent) => void;
}

export type PaintBrushFn = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
) => void;

export interface PaintState {
  brush: keyof typeof brushes;
  brushVariant: number;

  fgColor: number[];
  bgColor: number[];

  zoom: number;
}

export const defaultPaintState: PaintState = {
  brush: 'pencil',
  brushVariant: 0,

  fgColor: [0, 0, 0],
  bgColor: [255, 255, 255],

  zoom: 1,
};
