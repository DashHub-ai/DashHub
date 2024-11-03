import type { Config } from 'tailwindcss';

import franken from 'franken-ui/shadcn-ui/preset-quick';

export default {
  presets: [
    franken() as unknown as Config,
  ],
  content: [
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
