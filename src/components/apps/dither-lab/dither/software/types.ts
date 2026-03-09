import type { Palette } from '../palettes/types';

export type ProgressFn = (
  current: number,
  total: number,
  partial?: ImageData,
) => void;

type ProcessFn = (
  dataIn: ImageData,
  palette: Palette,
  settings: { [key: string]: number | string },
  cbProgress: ProgressFn | null,
) => ImageData;

export interface SoftwareRenderProcess {
  id: string;
  name: string;
  run: ProcessFn;

  maxAllowedPaletteSize: number;
  supports: {
    threads: boolean;
    gamma: boolean;
  };
  complexity: (n: number) => number;
}
