import type { PaintBrush } from '../types';

export const dropper: PaintBrush = {
  name: 'dropper',
  onPointerDown: ({ ctx, x, y, setState, pointerEvent }) => {
    const bg = pointerEvent.buttons === 2;

    const pixel = ctx.getImageData(x, y, 1, 1);
    const [r, g, b] = pixel.data;

    console.log(r, g, b);

    if (bg) setState({ bgColor: [r, g, b] });
    else setState({ fgColor: [r, g, b] });
  },
  onPointerMove: () => {},
};
