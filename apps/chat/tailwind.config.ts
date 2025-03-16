import type { Config } from 'tailwindcss';

import path from 'node:path';

import typography from '@tailwindcss/typography';
import franken from 'franken-ui/shadcn-ui/preset-quick';
import { fontFamily } from 'tailwindcss/defaultTheme';

export default {
  presets: [
    franken() as unknown as Config,
  ],
  content: [
    path.join(__dirname, '../../packages/ui/src/**/*.{ts,tsx}'),
    './fonts/**/*.css',
    './src/**/*.{js,jsx,ts,tsx}',
    'index.html',
  ],
  safelist: [
    {
      pattern: /^uk-/,
    },
    'ProseMirror',
    'ProseMirror-focused',
    'tiptap',
  ],
  theme: {
    extend: {
      container: {
        screens: {
          'sm': '640px',
          'md': '768px',
          'lg': '1024px',
          'xl': '1280px',
          '2xl': '1536px',
        },
      },
      screens: {
        '3xl': '1900px',
      },
      animation: {
        slideIn: 'slideIn 0.3s ease-out forwards',
        fadeIn: 'fadeIn 0.3s ease-out forwards',
        messageSlideIn: 'slideIn 0.3s ease-out 100ms forwards',
        balloonIn: 'balloonIn 0.2s ease-out forwards',
      },
      fontFamily: {
        dmsans: ['DM Sans', ...fontFamily.sans],
        manrope: ['Manrope', ...fontFamily.sans],
      },
      colors: {
        stone: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a6a09b',
          500: '#79716b',
          600: '#57534d',
          700: '#44403b',
          800: '#292524',
          900: '#1c1917',
          950: '#0c0a09',
        },
      },
    },
  },
  plugins: [
    typography,
  ],
} satisfies Config;
