import Win4bRGBI from '~/dither/palettes/Win4bRGBI';
import { type Palette, PaletteGroup } from '~/dither/palettes/types';

export interface DitherLabSettings {
  showStatusBar: boolean;
  showPaletteEditor: boolean;
  panelSide: 'left' | 'right';
}

export const defaultDitherLabSettings: DitherLabSettings = {
  showStatusBar: true,
  showPaletteEditor: false,
  panelSide: 'right',
};

export interface DitherLabState {
  image?: {
    filename: string;
    url: string;
    size: number;
  };
  naturalWidth?: number;
  naturalHeight?: number;

  resizeMode: 'none' | 'fit' | 'stretch';
  width: number;
  height: number;
  renderWidth: number;
  renderHeight: number;

  paletteGroup: PaletteGroup;
  palette: Palette;

  process: string;
  settings: { [key: string]: number | string };
  uniforms: { [key: string]: number };

  zoom: number;
}

export const defaultDitherLabState: DitherLabState = {
  resizeMode: 'fit',
  width: 400,
  height: 300,
  renderWidth: 0,
  renderHeight: 0,

  paletteGroup: PaletteGroup.RetroPC,
  palette: Win4bRGBI,

  process: 'pattern',
  settings: {
    quality: 'high',
    threshold: 'bayer8',
  },
  uniforms: { u_err_mult: 0.2, u_gamma: 2.2, u_variance: 3 },

  zoom: 1,
};
