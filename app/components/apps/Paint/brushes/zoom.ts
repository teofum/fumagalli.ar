import type { PaintBrush } from '../types';

const ZOOM_STOPS = [2, 4, 6, 8];

export const zoom: PaintBrush = {
  name: 'zoom',
  onPointerDown: ({ brushVariant, state, setState }) => {
    if (state.zoom !== 1) setState({ zoom: 1 });
    else setState({ zoom: ZOOM_STOPS[brushVariant] });
  },
  onPointerMove: () => {},
};
