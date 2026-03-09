import bayer2 from './bayer2';
import bayer4 from './bayer4';
import bayer8 from './bayer8';
import blueNoise16 from './blueNoise16';
import blueNoise64 from './blueNoise64';
import halftone4 from './halftone4';
import halftone6 from './halftone6';
import halftone8 from './halftone8';

const thresholds = {
  bayer8,
  bayer4,
  bayer2,
  blueNoise64,
  blueNoise16,
  halftone8,
  halftone6,
  halftone4
};

export default thresholds;