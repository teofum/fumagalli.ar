export interface SystemTheme {
  name: string;
  cssClass: string;
}

export interface ThemeCustomization {
  backgroundColor?: string;
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
    name: 'Champagne',
    cssClass: 'theme-champagne',
  },
  {
    name: 'Jade',
    cssClass: 'theme-jade',
  },
  {
    name: 'Steel',
    cssClass: 'theme-steel',
  },
  {
    name: 'Midnight',
    cssClass: 'theme-midnight',
  },
];

export const defaultTheme = themes[0];
