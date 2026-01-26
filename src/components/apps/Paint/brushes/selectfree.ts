import clamp from "@/utils/clamp";
import type { PaintBrush } from "../types";
import clear from "../utils/clear";
import drawLineArray from "../utils/drawLineArray";
import fillPolygon, { getBoundingBox } from "../utils/fillPolygon";

const MIN_DISTANCE = 4;
const MIN_DISTANCE_SQUARED = MIN_DISTANCE * MIN_DISTANCE;

export const selectfree: PaintBrush = {
  name: "Freehand Selection",
  hint: "Draw any shape to select an area of the picture in that shape.",
  onPointerDown: ({
    x,
    y,
    scratch,
    scratchCtx,
    scratchCanvas,
    pointerEvent,
  }) => {
    if (pointerEvent.buttons === 2) return;

    clear(scratchCtx);
    scratchCanvas.style.setProperty("mix-blend-mode", "difference");

    scratch.points = [{ x, y }];
  },
  onPointerMove: ({ x, y, scratch, scratchCtx }) => {
    clear(scratchCtx);

    if (scratch.points) {
      const { x: lastX, y: lastY } = scratch.points.at(-1) as {
        x: number;
        y: number;
      };

      const dx = x - lastX;
      const dy = y - lastY;
      const dSquared = dx * dx + dy * dy;

      scratchCtx.fillStyle = "white";
      drawLineArray(scratchCtx, [...scratch.points, { x, y }]);

      if (dSquared >= MIN_DISTANCE_SQUARED) {
        scratch.points.push({ x, y });
      }
    }
  },
  onPointerUp: ({
    canvas,
    ctx,
    x,
    y,
    bg,
    scratch,
    scratchCtx,
    scratchCanvas,
    select,
    deselect,
  }) => {
    clear(scratchCtx);
    scratchCanvas.style.setProperty("mix-blend-mode", "normal");

    if (scratch.points && scratch.points.length > 2) {
      const { x: x0, y: y0 } = scratch.points[0];

      const dx = x - x0;
      const dy = y - y0;

      // Draw the filled polygon to the scratch canvas, to be used as a selection mask
      scratchCtx.fillStyle = "white";
      fillPolygon(scratchCtx, scratch.points.slice(0, -1));

      if (dx !== 0 || dy !== 0) scratch.points.push({ x: x0, y: y0 }); // Close polygon

      // Get selection bounds
      const selectionBounds = getBoundingBox(scratch.points.slice(0, -1));
      const sx = clamp(selectionBounds.left, 0, canvas.width);
      const sy = clamp(selectionBounds.top, 0, canvas.height);
      const sw = clamp(selectionBounds.right - sx, 0, canvas.width);
      const sh = clamp(selectionBounds.bottom - sy, 0, canvas.height);

      if (sw !== 0 && sh !== 0) {
        select({ x: sx, y: sy, w: sw, h: sh }, true);

        // Fill selection area in drawing canvas with bg color
        ctx.fillStyle = bg;
        fillPolygon(ctx, scratch.points.slice(0, -1));
      } else deselect();
    } else deselect();

    // Clear scratch
    Object.keys(scratch).forEach((key) => delete scratch[key]);
  },
};
