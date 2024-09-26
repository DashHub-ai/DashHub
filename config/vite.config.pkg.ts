import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import tsconfigPaths from 'vite-tsconfig-paths';

import { nodeExternals } from './vite-plugins';

export default defineConfig({
  build: {
    target: 'esnext',
    lib: {
      entry: 'src/index',
      fileName: 'index',
      formats: ['es'],
    },
    sourcemap: true,
    emptyOutDir: true,
  },
  plugins: [
    dts(),
    react(),
    tsconfigPaths(),
    nodeExternals(),
  ],
});
