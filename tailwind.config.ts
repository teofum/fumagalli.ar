import type { Config } from 'tailwindcss';
import colors from 'tailwindcss/colors';

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    fontFamily: {
      sans: '"PX Sans Nouveaux"',
      title: '"PX Sans Nouveaux"',
      text: 'Paradise132',
      heading: 'ToshibaTxL1',
      display: '"DOS/V re. JPN24"',
      minesweeper: '"Nix8810 M15"',
    },
    fontSize: {
      base: ['0.5rem', '1rem'],
      lg: ['0.75rem', '1rem'],
      xl: ['1rem', '1.25rem'],
      '2xl': ['1.5rem', '1'],
      '3xl': ['2rem', '1'],
      '4xl': ['3rem', '1'],
    },
    fontWeight: {
      normal: '400',
    },
    colors: {
      // Utility colors
      transparent: colors.transparent,
      current: colors.current,
      inherit: colors.inherit,
      black: colors.black,
      white: colors.white,

      desktop: 'rgb(var(--color-desktop) / <alpha-value>)',
      highlight: 'rgb(var(--color-highlight) / <alpha-value>)',

      surface: 'rgb(var(--color-surface) / <alpha-value>)',
      'surface-dark': 'rgb(var(--color-dark) / <alpha-value>)',
      'surface-darker': 'rgb(var(--color-darker) / <alpha-value>)',
      'surface-light': 'rgb(var(--color-light) / <alpha-value>)',
      'surface-lighter': 'rgb(var(--color-lighter) / <alpha-value>)',

      light: 'rgb(var(--color-text-light) / <alpha-value>)',
      disabled: 'rgb(var(--color-text-disabled) / <alpha-value>)',
      'disabled-shadow':
        'rgb(var(--color-text-disabled-shadow) / <alpha-value>)',
    },
    dropShadow: {
      disabled: '1px 1px 0 rgb(var(--color-text-disabled-shadow))',
    },
    zIndex: {
      1000: '1000',
      2000: '2000',
      3000: '3000',
      4000: '4000',
      5000: '5000',
      6000: '6000',
    },
    extend: {
      backgroundColor: {
        default: 'rgb(var(--color-background) / <alpha-value>)',
        selection: 'rgb(var(--color-selection-bg) / <alpha-value>)',
      },
      textColor: {
        default: 'rgb(var(--color-text) / <alpha-value>)',

        title: 'rgb(var(--color-title) / <alpha-value>)',
        h1: 'rgb(var(--color-heading) / <alpha-value>)',
        h2: 'rgb(var(--color-heading-2) / <alpha-value>)',
        h3: 'rgb(var(--color-heading-3) / <alpha-value>)',

        accent: 'rgb(var(--color-text-accent) / <alpha-value>)',
        link: 'rgb(var(--color-text-link) / <alpha-value>)',
        visited: 'rgb(var(--color-text-visited) / <alpha-value>)',

        selection: 'rgb(var(--color-selection-text) / <alpha-value>)',
      },
      borderColor: {
        default: 'rgb(var(--color-text) / <alpha-value>)',
      },
    },
  },
  plugins: [],
} satisfies Config;
