import node from '@astrojs/node';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'hybrid',
  integrations: [tailwind()],
  adapter: node({
    mode: 'standalone',
  }),
  vite: {
    ssr: {
      noExternal: true,
    },
  },
});
