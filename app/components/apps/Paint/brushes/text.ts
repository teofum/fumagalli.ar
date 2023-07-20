import type { PaintBrush } from '../types';
import clear from '../utils/clear';
import drawRect from '../utils/drawRect';
import drawText from '../utils/drawText';
import getPixelData from '../utils/getPixelData';

export const text: PaintBrush = {
  name: 'Text',
  hint: 'Click and type to add text. Click again to confirm.',
  onPointerDown: ({ x, y, scratch }) => {
    if (scratch.typing) return;

    scratch.x = x;
    scratch.y = y;
  },
  onPointerMove: ({ scratchCtx, x, y, scratch }) => {
    if (scratch.typing) return;

    clear(scratchCtx);

    scratch.w = x - scratch.x;
    scratch.h = y - scratch.y;

    scratchCtx.fillStyle = 'black';
    drawRect(scratchCtx, scratch.x, scratch.y, scratch.w, scratch.h, 'stroke');
  },
  onPointerUp: ({
    ctx,
    scratchCtx,
    scratch,
    fg,
    bg,
    pointerEvent,
    updateHistory,
  }) => {
    if (scratch.typing) return;

    const color = pointerEvent.buttons === 2 ? bg : fg;

    const tempInput = document.createElement('textarea');
    tempInput.style.position = 'fixed';
    tempInput.style.inset = '0';
    tempInput.style.zIndex = '999999999';
    tempInput.style.opacity = '0';
    document.body.appendChild(tempInput);
    tempInput.focus();

    scratch.typing = true;

    tempInput.addEventListener('input', (ev) => {
      const text = (ev.target as HTMLInputElement).value;

      clear(scratchCtx);
      scratchCtx.fillStyle = color;
      drawText(scratchCtx, text, {
        x: scratch.x,
        y: scratch.y,
        width: scratch.w,
        height: scratch.h,
        fontSize: 8,
        lineHeight: 16,
        font: 'PX Sans Nouveaux',
        align: 'left',
        vAlign: 'top',
      });
    });

    const commit = (ev: Event) => {
      const text = (ev.target as HTMLInputElement).value;

      if (text) {
        const scratchData = scratchCtx.getImageData(
          scratch.x,
          scratch.y - 8,
          scratch.w,
          scratch.h + 16,
        );
        const imageData = ctx.getImageData(
          scratch.x,
          scratch.y - 8,
          scratch.w,
          scratch.h + 16,
        );

        const pixelScratchData = getPixelData(scratchData);
        const pixelData = getPixelData(imageData);

        for (let i = 0; i < pixelData.data.length; i++) {
          const scratchAlpha = scratchData.data[i * 4 + 3];
          pixelData.data[i] =
            scratchAlpha === 255 ? pixelScratchData.data[i] : pixelData.data[i];
        }

        ctx.putImageData(imageData, scratch.x, scratch.y - 8);
        updateHistory();
      }
      clear(scratchCtx);

      // Clear scratch
      Object.keys(scratch).forEach((key) => delete scratch[key]);
      tempInput.remove();
    };

    tempInput.addEventListener('pointerdown', commit);
  },
};
