import type { Config } from 'tailwindcss';

import path from 'node:path';

import typography from '@tailwindcss/typography';
import franken from 'franken-ui/shadcn-ui/preset-quick';

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
      animation: {
        slideIn: 'slideIn 0.3s ease-out forwards',
        fadeIn: 'fadeIn 0.3s ease-out forwards',
        messageSlideIn: 'slideIn 0.3s ease-out 100ms forwards',
        balloonIn: 'balloonIn 0.2s ease-out forwards',
      },
    },
  },
  plugins: [
    typography,
  ],
} satisfies Config;
