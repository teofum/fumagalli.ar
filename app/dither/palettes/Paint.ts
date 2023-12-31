import { type Palette, PaletteType, PaletteGroup } from './types';

const PaintColors: Palette = {
  name: 'Paint default colors',
  type: PaletteType.Indexed,
  group: PaletteGroup.Other,
  data: [
    0x00, 0x00, 0x00, // Black
    0xFF, 0xFF, 0xFF, // White
    0x80, 0x80, 0x80, // Dark Grey
    0xC0, 0xC0, 0xC0, // Light Grey
    0x80, 0x00, 0x00, // Dark Red
    0xFF, 0x00, 0x00, // Red
    0x80, 0x80, 0x00, // Dark Yellow
    0xFF, 0xFF, 0x00, // Yellow
    0x00, 0x80, 0x00, // Dark Green
    0x00, 0xFF, 0x00, // Green
    0x00, 0x80, 0x80, // Dark Cyan
    0x00, 0xFF, 0xFF, // Cyan
    0x00, 0x00, 0x80, // Dark Blue
    0x00, 0x00, 0xFF, // Blue
    0x80, 0x00, 0x80, // Dark Magenta
    0xFF, 0x00, 0xFF, // Magenta
    0x80, 0x80, 0x40, // Dark Yellowish
    0xFF, 0xFF, 0x80, // Yellowish
    0x00, 0x40, 0x40, // Dark Blue-green
    0x00, 0xFF, 0x80, // Blue-green
    0x00, 0x80, 0xFF, // Dark Sky
    0x80, 0xFF, 0xFF, // Sky
    0x00, 0x40, 0x80, // Navy
    0x80, 0x80, 0xFF, // Lavender
    0x40, 0x00, 0xFF, // Purple
    0xFF, 0x00, 0x80, // Pink-red
    0x80, 0x40, 0x00, // Brown
    0xFF, 0x80, 0x40, // Orange
  ]
};

export default PaintColors;