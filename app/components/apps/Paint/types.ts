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
