import path from 'node:path';

import react from '@vitejs/plugin-react';
import glob from 'tiny-glob/sync';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import tsconfigPaths from 'vite-tsconfig-paths';

import { nodeExternals } from './plugins/vite-node-externals';

const ALL_PACKAGE_JSON_PATHS = glob(
  path.resolve(import.meta.dirname, '../packages/*/package.json'),
);

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
    nodeExternals({
      packagePath: ALL_PACKAGE_JSON_PATHS,
    }),
  ],
});
