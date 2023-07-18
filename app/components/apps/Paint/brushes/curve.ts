import type { PaintBrush, PaintBrushFn } from '../types';
import clear from '../utils/clear';
import { drawCubicBezier, drawQuadraticBezier } from '../utils/drawBezier';
import drawLine from '../utils/drawLine';

const functions: PaintBrushFn[] = [
  (ctx, x, y) => {
    ctx.fillRect(x, y, 1, 1);
  },
  (ctx, x, y) => {
    ctx.fillRect(x - 1, y - 1, 2, 2);
  },
  (ctx, x, y) => {
    ctx.fillRect(x, y - 1, 1, 3);
    ctx.fillRect(x - 1, y, 3, 1);
  },
  (ctx, x, y) => {
    ctx.fillRect(x - 1, y - 2, 2, 4);
    ctx.fillRect(x - 2, y - 1, 4, 2);
  },
  (ctx, x, y) => {
    ctx.fillRect(x - 2, y - 3, 3, 5);
    ctx.fillRect(x - 3, y - 2, 5, 3);
  },
];

export const curve: PaintBrush = {
  name: 'curve',
  onPointerDown: ({ x, y, fg, bg, pointerEvent, scratch, scratchCtx }) => {
    switch (scratch.curveStage) {
      case 1: {
        return;
      }
      case 2: {
        return;
      }
      default: {
        const color = pointerEvent.buttons === 2 ? bg : fg;

        clear(scratchCtx);

        // Set up curve data
        scratch.color = color;
        scratch.x0 = x;
        scratch.y0 = y;
        scratch.x3 = x;
        scratch.y3 = y;
        return;
      }
    }
  },
  onPointerMove: ({ x, y, scratch, scratchCtx: sctx, brushVariant }) => {
    switch (scratch.curveStage) {
      case 1: {
        scratch.x1 = x;
        scratch.y1 = y;

        clear(sctx);

        const brushFn = functions[brushVariant];

        sctx.fillStyle = scratch.color;
        drawQuadraticBezier(
          sctx,
          scratch.x0,
          scratch.y0,
          scratch.x1,
          scratch.y1,
          scratch.x3,
          scratch.y3,
          brushFn,
        );
        return;
      }
      case 2: {
        scratch.x2 = x;
        scratch.y2 = y;

        clear(sctx);

        const brushFn = functions[brushVariant];

        sctx.fillStyle = scratch.color;
        drawCubicBezier(
          sctx,
          scratch.x0,
          scratch.y0,
          scratch.x1,
          scratch.y1,
          scratch.x2,
          scratch.y2,
          scratch.x3,
          scratch.y3,
          brushFn,
        );
        return;
      }
      default: {
        scratch.x3 = x;
        scratch.y3 = y;

        clear(sctx);

        const brushFn = functions[brushVariant];

        sctx.fillStyle = scratch.color;
        drawLine(sctx, scratch.x0, scratch.y0, x, y, brushFn);
        return;
      }
    }
  },
  onPointerUp: ({ ctx, scratch, scratchCtx, brushVariant, updateHistory }) => {
    switch (scratch.curveStage) {
      case 1: {
        scratch.curveStage = 2;
        return;
      }
      case 2: {
        clear(scratchCtx);

        const brushFn = functions[brushVariant];

        ctx.fillStyle = scratch.color;
        drawCubicBezier(
          ctx,
          scratch.x0,
          scratch.y0,
          scratch.x1,
          scratch.y1,
          scratch.x2,
          scratch.y2,
          scratch.x3,
          scratch.y3,
          brushFn,
        );

        updateHistory();

        // Clear scratch
        Object.keys(scratch).forEach((key) => delete scratch[key]);
        return;
      }
      default: {
        scratch.curveStage = 1;
        return;
      }
    }
  },
};
