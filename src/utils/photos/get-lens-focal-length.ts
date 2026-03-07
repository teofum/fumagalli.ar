const LENS_FALLBACK_FL = {
  '24.0 mm f/2.8': 24,
  '35.0 mm f/2.0': 35,
  'Nikkor 20mm f/4 AI': 20,
  'Nikkor-S 50mm f/1.4': 50,
  'Micro Nikkor 55mm f/2.8 AI-s': 55,
};

export function getLensFallbackFocalLength(lens: string | undefined) {
  if (!lens) return undefined;
  return LENS_FALLBACK_FL[lens as keyof typeof LENS_FALLBACK_FL];
}
