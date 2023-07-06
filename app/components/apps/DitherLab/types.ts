export interface DitherLabState {
  image?: {
    filename: string;
    url: string;
    size: number;
  };
  resizeMode: 'none' | 'fit' | 'stretch';
  width: number;
  height: number;
}

export const defaultDitherLabState: DitherLabState = {
  resizeMode: 'fit',
  width: 800,
  height: 600,
};
