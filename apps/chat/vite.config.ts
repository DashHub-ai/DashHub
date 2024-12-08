import { resolve } from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/app/' : '/',
  server: {
    host: true,
    port: 5173,
  },
  envPrefix: ['VITE_', 'PUBLIC_VITE_'],
  plugins: [
    react(),
    tsconfigPaths(),
  ],
  ...mode !== 'production' && {
    resolve: {
      alias: {
        'lucide-react/dynamicIconImports': resolve(__dirname, './src/modules/shared/fake-lazy-dynamic-icons.tsx'),
      },
    },
  },
}));
