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
];

export const defaultTheme = themes[0];
