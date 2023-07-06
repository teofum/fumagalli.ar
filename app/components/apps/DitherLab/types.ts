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

  process: string;
  settings: { [key: string]: number | string };
  uniforms: { [key: string]: number };
}

export const defaultDitherLabState: DitherLabState = {
  resizeMode: 'fit',
  width: 400,
  height: 300,
  renderWidth: 0,
  renderHeight: 0,

  process: 'pattern',
  settings: {
    quality: 'high',
    threshold: 'bayer8',
  },
  uniforms: { u_err_mult: 0.2, u_gamma: 2.2, u_variance: 3 },
};
