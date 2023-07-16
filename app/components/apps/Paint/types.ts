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
}

export interface PaintBrush {
  name: string;

  onPointerDown: (ev: PaintEvent) => void;
  onPointerMove: (ev: PaintEvent) => void;
}

export interface PaintState {
  brush: keyof typeof brushes;

  fgColor: number[];
  bgColor: number[];
}

export const defaultPaintState: PaintState = {
  brush: 'pencil',

  fgColor: [0, 0, 0],
  bgColor: [255, 255, 255],
};
