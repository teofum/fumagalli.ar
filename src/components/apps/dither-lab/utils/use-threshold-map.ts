import { useMemo } from 'react';

import tex2DFromData from '@/utils/gl/tex2DFromData';

import thresholds from '../dither/thresholdMaps';
import makeRandomThreshold from '../dither/thresholdMaps/makeRandomThreshold';
import { RenderSettings } from '../renderers/use-gl-renderer';

export default function useThresholdMap(
  gl: WebGL2RenderingContext | null,
  rt: HTMLCanvasElement | null,
  settings: RenderSettings,
) {
  const thresholdMap = useMemo(() => {
    if (!rt || !gl) return null;

    const threshold =
      settings.threshold === 'random'
        ? makeRandomThreshold(Math.max(rt.width, rt.height))
        : thresholds[settings.threshold ?? 'bayer8'];

    // Load image to texture 0 and threshold matrix to texture 1
    tex2DFromData(
      gl,
      threshold.size,
      threshold.size,
      threshold.data,
      {
        format: gl.LUMINANCE,
        internalFormat: gl.LUMINANCE,
        type: gl.UNSIGNED_BYTE,
      },
      gl.TEXTURE1,
    );

    return threshold;
  }, [rt, gl, settings]);

  return thresholdMap;
}
