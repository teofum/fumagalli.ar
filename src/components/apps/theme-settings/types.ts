export interface SystemTheme {
  name: string;
  cssClass: string;
}

export interface ThemeCustomization {
  backgroundColor?: string | null;
  backgroundUrl?: string;
  backgroundImageMode: 'center' | 'tile' | 'stretch' | 'fill';
}

export const themes: SystemTheme[] = [
  {
    name: 'Default Light',
    cssClass: 'theme-default',
  },
  {
    name: 'Default Dark',
    cssClass: 'theme-dark',
  },
  {
    name: 'Y2K',
    cssClass: 'theme-champagne',
  },
  {
    name: 'Jade',
    cssClass: 'theme-jade',
  },
  {
    name: 'Air',
    cssClass: 'theme-air',
  },
  {
    name: 'Industrial',
    cssClass: 'theme-industrial',
  },
  {
    name: 'Steel',
    cssClass: 'theme-steel',
  },
  {
    name: 'Forest',
    cssClass: 'theme-wood',
  },
  {
    name: 'Midnight',
    cssClass: 'theme-midnight',
  },
];

export const defaultTheme = themes[0];
