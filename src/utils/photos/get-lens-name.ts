const LENS_NAMES = {
  '0.0 mm f/0.0': 'Non-CPU Nikkor lens',
  '24.0 mm f/2.8': 'AF Nikkor 24mm f/2.8D',
  '35.0 mm f/2.0': 'AF Nikkor 35mm f/2D',
  '18.0-105.0 mm f/3.5-5.6': 'AF-S Nikkor 18-105mm f/3.5-5.6 VR',
  'EF28-135mm f/3.5-5.6 IS USM': 'EF 28-135mm f/3.5-5.6 IS USM',
  'EF70-300mm f/4-5.6L IS USM': 'EF 70-300mm f/4-5.6L IS USM',
  'EF85mm f/1.8 USM': 'EF 85mm f/1.8 USM',
  'RF14-35mm F4 L IS USM': 'RF 14-35mm f/4L IS USM',
  'RF50mm F1.8 STM': 'RF 50mm f/1.8 STM',
};

export function getLensDisplayName(lens: string | undefined) {
  if (!lens) return 'Unknown lens';
  return LENS_NAMES[lens as keyof typeof LENS_NAMES] ?? lens;
}
