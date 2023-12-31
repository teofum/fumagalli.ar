import type { PaintBrush } from '../types';

export const ZOOM_STOPS = [2, 4, 6, 8];

export const zoom: PaintBrush = {
  name: 'Zoom',
  hint: 'Click to zoom in and out.',
  onPointerDown: ({ brushVariant, state, setState }) => {
    if (state.zoom !== 1) setState({ zoom: 1 });
    else setState({ zoom: ZOOM_STOPS[brushVariant] });
  },
  onPointerMove: () => {},
};
