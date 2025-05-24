import { existsSync } from 'node:fs';
import path from 'node:path';
import { env } from 'node:process';

import { swc } from 'rollup-plugin-swc3';
import glob from 'tiny-glob';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

import { nodeExternals } from '../../config/plugins/vite-node-externals';

const CLI_ENTRIES = await (async () => {
  const files = await glob(
    path.join(import.meta.dirname, 'src/cli/*.cli.ts'),
  );

  return files.reduce(
    (acc, filePath) => {
      acc[path.basename(filePath, '.ts')] = filePath;

      return acc;
    },
    Object.create(null),
  );
})();

const COMMERCIAL_PATH = path.resolve(
  import.meta.dirname,
  '../../externals/commercial/backend/src',
);

export default defineConfig({
  esbuild: false,
  build: {
    target: 'esnext',
    lib: {
      entry: {
        index: 'src/index',
        ...CLI_ENTRIES,
      },
      formats: ['es'],
    },
    rollupOptions: {
      output: {
        entryFileNames: `[name].mjs`,
        chunkFileNames: `[name].mjs`,
      },
    },
    sourcemap: true,
    emptyOutDir: false,
    minify: false,
  },
  define: {
    'process.env': {
      NODE_ENV: env.NODE_ENV || 'development',
    },
  },
  plugins: [
    nodeExternals({
      exclude: [/@dashhub\/.*/],
    }),
    tsconfigPaths(),
    swc({
      sourceMaps: true,
      tsconfig: `tsconfig${existsSync(COMMERCIAL_PATH) ? '.commercial' : ''}.json`,
      jsc: {
        parser: {
          syntax: 'typescript',
          tsx: false,
          dynamicImport: false,
          decorators: true,
        },
      },
    }),
  ],
});
