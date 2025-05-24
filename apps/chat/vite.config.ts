import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const COMMERCIAL_PATH = resolve(import.meta.dirname, '../../externals/commercial/chat/src/index.ts');

export default defineConfig(({ mode }) => ({
  base: '/',
  server: {
    host: true,
    port: 5173,
  },
  envPrefix: ['VITE_', 'PUBLIC_VITE_'],
  plugins: [
    react(),
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      ...existsSync(COMMERCIAL_PATH) && {
        '~/commercial/index': COMMERCIAL_PATH,
      },
      ...mode !== 'production' && {
        'lucide-react/dynamicIconImports': resolve(__dirname, './src/modules/shared/fake-lazy-dynamic-icons.tsx'),
      },
    },
  },
}));
