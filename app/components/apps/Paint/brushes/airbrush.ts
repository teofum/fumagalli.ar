import type { PaintBrush } from '../types';
import setPixel from '../utils/setPixel';

const SPRAY_RADIUS = [4, 8, 12];

function spray(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  density: number,
) {
  for (let i = 0; i < density; i++) {
    let x = 0;
    let y = 0;

    do {
      x = Math.floor(Math.random() * (radius + 1) * 2) - radius;
      y = Math.floor(Math.random() * (radius + 1) * 2) - radius;
    } while (x * x + y * y > radius * radius);

    setPixel(ctx, cx + x, cy + y);
  }
}

export const airbrush: PaintBrush = {
  name: 'Airbrush',
  hint: 'Draw using an airbrush of the selected size.',
  onPointerDown: ({
    ctx,
    x,
    y,
    fg,
    bg,
    pointerEvent,
    scratch,
    brushVariant,
  }) => {
    const color = pointerEvent.buttons === 2 ? bg : fg;
    const radius = SPRAY_RADIUS[brushVariant];

    ctx.fillStyle = color;
    spray(ctx, x, y, radius, 8);

    const frame = () => {
      spray(ctx, x, y, radius, 2);
      scratch.raf = requestAnimationFrame(frame);
    };
    scratch.raf = requestAnimationFrame(frame);
  },
  onPointerMove: ({
    ctx,
    x,
    y,
    fg,
    bg,
    pointerEvent,
    scratch,
    brushVariant,
  }) => {
    const color = pointerEvent.buttons === 2 ? bg : fg;
    const radius = SPRAY_RADIUS[brushVariant];

    ctx.fillStyle = color;
    spray(ctx, x, y, radius, 8);

    cancelAnimationFrame(scratch.raf);
    const frame = () => {
      spray(ctx, x, y, radius, 2);
      scratch.raf = requestAnimationFrame(frame);
    };
    scratch.raf = requestAnimationFrame(frame);
  },
  onPointerUp: ({ scratch, updateHistory }) => {
    cancelAnimationFrame(scratch.raf);
    updateHistory();
  },
};
