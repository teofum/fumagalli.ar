import type { PaintBrush } from '../types';
import clear from '../utils/clear';
import drawRect from '../utils/drawRect';
import drawText from '../utils/drawText';

export const text: PaintBrush = {
  name: 'text',
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
  onPointerUp: ({ ctx, scratchCtx, scratch, fg, bg, pointerEvent }) => {
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
        const pixelScratchData = {
          width: scratchData.width,
          height: scratchData.height,
          data: new Uint32Array(scratchData.data.buffer),
        };
        const imageData = ctx.getImageData(
          scratch.x,
          scratch.y - 8,
          scratch.w,
          scratch.h + 16,
        );
        const pixelData = {
          width: imageData.width,
          height: imageData.height,
          data: new Uint32Array(imageData.data.buffer),
        };

        for (let i = 0; i < pixelData.data.length; i++) {
          const scratchAlpha = scratchData.data[i * 4 + 3];
          pixelData.data[i] =
            scratchAlpha === 255 ? pixelScratchData.data[i] : pixelData.data[i];
        }

        ctx.putImageData(imageData, scratch.x, scratch.y - 8);
      }
      clear(scratchCtx);

      // Clear scratch
      Object.keys(scratch).forEach((key) => delete scratch[key]);
      tempInput.remove();
    };

    tempInput.addEventListener('pointerdown', commit);
  },
};
