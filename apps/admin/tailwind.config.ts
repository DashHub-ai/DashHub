import type { Config } from 'tailwindcss';

import path from 'node:path';

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
    extend: {},
  },
  plugins: [],
} satisfies Config;
