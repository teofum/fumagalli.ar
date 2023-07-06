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
}

export const defaultDitherLabState: DitherLabState = {
  resizeMode: 'fit',
  width: 800,
  height: 600,
  renderWidth: 0,
  renderHeight: 0,
};
