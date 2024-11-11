import process from 'node:process';

import node from '@astrojs/node';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'server',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
  ],
  adapter: node({
    mode: 'standalone',
  }),
  ...(process.env.NODE_ENV !== 'development' && {
    vite: {
      ssr: {
        noExternal: true,
      },
    },
  }),
});
