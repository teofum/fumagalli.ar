export interface SystemTheme {
  name: string;
  cssClass: string;
}

export const themes: SystemTheme[] = [
  {
    name: 'TeOS Default',
    cssClass: 'theme-default',
  },
  {
    name: 'TeOS Dark',
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
