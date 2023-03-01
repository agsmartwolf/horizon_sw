/* eslint-disable @typescript-eslint/no-var-requires */
const plugin = require('tailwindcss/plugin');

/** Calculates the line-height value from an input and a base
 * @param {number} fontSize Font-size value in pixels
 * @param {number} absoluteLineHeight Line-height value in pixels
 */
// const toRelative = (fontSize, absoluteLineHeight) =>
//   absoluteLineHeight / fontSize;

module.exports = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './utils/classMappings.ts',
    './lib/**/*.{ts,tsx}',
    './mock/**/*.{ts,tsx,json}',
    './page_layouts/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
  ],
  theme: {
    borderRadius: {
      none: '0',
      sm: '0.125rem',
      md: '0.25rem',
      lg: '0.5rem',
      xl: '1rem',
      '1.5xl': '1.125rem',
      '2xl': '1.25rem',
      '3xl': '1.5rem',
      '4xl': '2rem',
      full: '9999px',
      image: 'var(--borders-image-radius)',
    },
    fontFamily: {
      sans: [
        'var(--typography-font-family-body)',
        'Poppins',
        'ui-sans-serif',
        'system-ui',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        '"Noto Sans"',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
        '"Noto Color Emoji"',
      ],
      headings: ['var(--typography-font-family-headings)'],
      graphity: ['var(--typography-font-family-graphity)'],
      body: ['var(--typography-font-family-body)'],
    },
    fontSize: {
      '14xl': ['var(--typography-font-size-14xl)', 1.1],
      '10xl': ['var(--typography-font-size-10xl)', 1.1],
      '9xl': ['var(--typography-font-size-9xl)', 1.1],
      '8xl': ['var(--typography-font-size-8xl)', 1.1],
      '7xl': ['var(--typography-font-size-7xl)', 1.1],
      '6xl': ['var(--typography-font-size-6xl)', 1.2],
      '5xl': ['var(--typography-font-size-5xl)', 1.2],
      '4xl': ['var(--typography-font-size-4xl)', 1.4],
      '3xl': ['var(--typography-font-size-3xl)', 1.4],
      '2xl': ['var(--typography-font-size-2xl)', 1.4],
      xl: ['var(--typography-font-size-xl)', 1.4],
      lg: ['var(--typography-font-size-lg)', 1.4],
      md: ['var(--typography-font-size-md)', 1.5],
      sm: ['var(--typography-font-size-sm)', 1.5],
      xs: ['var(--typography-font-size-xs)', 1.5],
      '2xs': ['var(--typography-font-size-2xs)', 1.5],
      '3xs': ['var(--typography-font-size-3xs)', 1.5],
    },
    letterSpacing: {
      tight: '-0.0625rem',
      normal: '0',
      wide: '0.02em',
    },
    boxShadow: {
      '2xl': '0px 2px 8px rgba(0, 0, 0, 0.08)',
    },
    extend: {
      spacing: {
        15: '3.75rem',
        18: '4.5rem',
        20: '5rem',
        22: '5.5rem',
        23: '5.75rem',
        30: '7.5rem',
        46: '11.5rem',
        50: '12.5rem',
        70: '17.5rem',
        90: '22.5rem',
        112: '28rem',
      },
      maxWidth: {
        'screen-3xl': '1920px',
      },
      boxShadow: {
        '3xl': '0px 3px 32px 4px rgba(0, 0, 0, 0.07)',
        '4xl': '0px 4px 44px 4px rgba(0, 0, 0, 0.15)',
      },
      zIndex: {
        header: 9997,
        backdrop: 9998,
        modal: 9999,
      },
      transitionDuration: {
        400: '400ms',
        800: '800ms',
        1800: '1800ms',
      },
      keyframes: {
        fade: {
          '0%': {
            opacity: 0,
          },
          '100%': {
            opacity: 1,
          },
        },
        // Navigation menu
        'right-slide': {
          '0%': { transform: 'translateX(200px)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        'left-slide': {
          '0%': { transform: 'translateX(-200px)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        'exit-to-right': {
          '0%': { transform: 'translateX(0)', opacity: 1 },
          '100%': { transform: 'translateX(200px)', opacity: 0 },
        },
        'exit-to-left': {
          '0%': { transform: 'translateX(0)', opacity: 1 },
          '100%': { transform: 'translateX(-200px)', opacity: 0 },
        },
        'scale-in-content': {
          '0%': { transform: 'rotateX(-30deg) scale(0.9)', opacity: 0 },
          '100%': { transform: 'rotateX(0deg) scale(1)', opacity: 1 },
        },
        'scale-out-content': {
          '0%': { transform: 'rotateX(0deg) scale(1)', opacity: 1 },
          '100%': { transform: 'rotateX(-10deg) scale(0.95)', opacity: 0 },
        },
      },
      animation: {
        'fade-in': 'fade 700ms linear forwards',
        'fade-out': 'fade 700ms linear backwards',
        // Mega menu
        'enter-from-right': 'right-slide 0.25s ease forwards',
        'enter-from-left': 'left-slide 0.25s ease forwards',
        'exit-to-right': 'right-slide 0.25s ease backwards',
        'exit-to-left': 'left-slide 0.25s ease backwards',
        'scale-in-content': 'scale-in-content 0.2s ease',
        'scale-out-content': 'scale-out-content 0.2s ease',
      },
      colors: {
        'green-100': 'var(--green-100)',
        'green-200': 'var(--green-200)',
        'green-300': 'var(--green-300)',
        black: 'var(--black-100)',
        'black-200': 'var(--black-200)',
        'black-100': 'var(--black-100)',
        white: 'var(--white)',
        gray: 'var(--gray)',
        'gray-100': 'var(--gray-100)',
        'gray-200': 'var(--gray-200)',
        'gray-300': 'var(--gray-300)',
        'gray-400': 'var(--gray-400)',

        armygreen: '#4B5320',
        vibrantorange: '#FF7F00',
        poolblue: '#00A3E0',
        ribbonred: '#E60000',
        orangeade: '#F9A825',
        baltic: '#1E2D3C',
        neonyellow: '#F9F871',
        fuchsia: '#FF00FF',
        royalblue: '#002366',
        grassgreen: '#008000',
        funchsia: '#FF00FF',
        'grey/orange': '#FF7F00',
        'grey/yellow': '#F9F871',
        'grey/neon yellow': '#F9F871',
        'black/orange': '#FF7F00',
        'black/neon yellow': '#F9F871',
        glaciergray: '#E0E0E0',
        brightwhite: '#FFFFFF',
        blueradiance: '#00A3E0',
        calypsocoral: '#FF7F00',
        bluetopaz: '#00A3E0',
        blazingyellow: '#F9F871',
        hotcoral: '#FF7F00',
        blackink: '#000000',
        turquoise: '#00FFFF',
        rosso: '#FF0000',
        carrot: '#FF7F00',
        artic: '#E0E0E0',
        chocolate: '#7F3300',
        gold: '#FFD700',
        steel: '#7F7F7F',
        violet: '#7F00FF',
        wine: '#7F0000',

        body: 'var(--colors-body)',
        disabled: 'var(--gray-400)',
        dividers: 'var(--colors-dividers)',
        input: {
          standard: 'var(--colors-input-standard)',
        },
        transparent: 'transparent',
        error: {
          light: '#FAEDEC',
          dark: 'var(--colors-error-dark)',
        },
        success: {
          light: '#E3F2F0',
          dark: 'var(--colors-success-dark)',
        },
        warning: {
          light: '#FDF8EE',
          dark: '#F4A732',
        },
        button: {
          black: 'var(--colors-button-black)',
          white: 'var(--colors-button-white)',
          green: 'var(--colors-button-green)',
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-radix')(),
    require('@tailwindcss/line-clamp'),
    plugin(({ addVariant }) => {
      addVariant('touch', '@media (hover: none)');
    }),
  ],
};
