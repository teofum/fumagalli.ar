import type { Palette } from '../palettes/types';
import thresholds from '../thresholdMaps';
import { luma_srgb1 } from '../utils/colorUtils';
import { gammaCorrect } from '../utils/gamma';
import getPaletteColors from '../utils/paletteColors';
import type { ProgressFn, SoftwareRenderProcess } from './types';

const vec3distance = (a: number[], b: number[]): number => {
  return (
    (a[0] - b[0]) * (a[0] - b[0]) +
    (a[1] - b[1]) * (a[1] - b[1]) +
    (a[2] - b[2]) * (a[2] - b[2])
  );
};

const getClistSize = (quality: number | string) => {
  if (typeof quality === 'number') return quality;

  switch (quality) {
    case 'low':
      return 4;
    case 'medium':
      return 16;
    case 'high':
    default:
      return 64;
  }
};

function processPatternDither(
  dataIn: ImageData,
  palette: Palette,
  settings: { [key: string]: number | string },
  cbProgress: ProgressFn | null,
): ImageData {
  const colors = getPaletteColors(palette);
  const size = dataIn.width * dataIn.height * 4;
  const line = dataIn.width * 4;

  const thresholdMap =
    thresholds[
      String(settings.threshold ?? 'bayer8') as keyof typeof thresholds
    ];
  const gamma = Number(settings.gamma ?? 2.2);
  const cError = Number(settings.err_mult ?? 0.2);

  const clist: number[] = Array(getClistSize(settings.quality)).fill(-1);
  const target: number[] = [0, 0, 0];
  let color: number[];

  // Precalculate luma and gamma-corrected palette
  const pGamma = colors.map((c) => gammaCorrect(c, gamma));
  const luma = pGamma.map(luma_srgb1);
  const iGamma = Array(dataIn.data.length).fill(0);

  // First pass, gamma-correct source image
  for (let i = 0; i < size; i += 4) {
    const correct = gammaCorrect(
      Array.from(dataIn.data.slice(i, i + 3)),
      gamma,
    );
    for (let j = 0; j < 3; j++) iGamma[i + j] = correct[j];

    if (i % (line * 24) === 0 && cbProgress) cbProgress(i, size, dataIn);
  }

  for (let i = 0; i < size; i += 4) {
    color = Array.from(iGamma.slice(i, i + 4));
    const x = (i % line) / 4;
    const y = ~~(i / line);

    const ts = thresholdMap.size;
    const tsPadded = 4 * Math.ceil(ts / 4);
    const threshold = thresholdMap.data[(x % ts) + tsPadded * (y % ts)] / 255;

    const error = [0, 0, 0];
    clist.fill(-1);
    for (let j = 0; j < clist.length; j++) {
      for (let k = 0; k < 3; k++) target[k] = color[k] + error[k] * cError;

      let candidate = 0;
      let dMin = Number.MAX_VALUE;

      // Find the closest color from palette
      for (let k = 0; k < pGamma.length; k++) {
        const d = vec3distance(target, pGamma[k]);
        if (d < dMin) {
          dMin = d;
          candidate = k;
        }
      }

      // Add it to the candidate list
      clist[j] = candidate;

      // By adding the candidate's error to the next iteration,
      // the next candidate will compensate for that error thus
      // getting closer to the original color.
      for (let k = 0; k < 3; k++)
        error[k] = error[k] + color[k] - pGamma[candidate][k];
    }

    clist.sort((a, b) => luma[a] - luma[b]);

    let index = ~~(threshold * clist.length);
    if (index === clist.length) index = clist.length - 1;
    const chosen = clist[index];

    for (let j = 0; j < 3; j++) dataIn.data[i + j] = colors[chosen][j];

    if (i % (line * 4) === 0 && cbProgress) cbProgress(i, size, dataIn);
  }

  return dataIn;
}

const pattern: SoftwareRenderProcess = {
  id: 'ProcPatternDither',
  name: 'Pattern Dithering',
  run: processPatternDither,

  maxAllowedPaletteSize: 65536,
  supports: {
    threads: true,
    gamma: true,
  },
  complexity: (n) => n * 64,
};

export default pattern;
