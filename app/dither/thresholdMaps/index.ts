import bayerThreshold4 from './bayerThreshold4';
import bayerThreshold8 from './bayerThreshold8';
import blueNoiseThreshold16 from './blueNoiseThreshold16';
import blueNoiseThreshold64 from './blueNoiseThreshold64';
import halftoneThreshold4 from './halftoneThreshold4';
import halftoneThreshold6 from './halftoneThreshold6';
import halftoneThreshold8 from './halftoneThreshold8';

const thresholds = [
  bayerThreshold8,
  bayerThreshold4,
  blueNoiseThreshold64,
  blueNoiseThreshold16,
  halftoneThreshold8,
  halftoneThreshold6,
  halftoneThreshold4
];

export default thresholds;