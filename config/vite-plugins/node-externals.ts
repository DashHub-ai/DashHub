import type { Plugin } from 'vite';

import { nodeExternals as rollupNodeExternals } from 'rollup-plugin-node-externals';

export function nodeExternals(): Plugin {
  return {
    ...rollupNodeExternals({
      exclude: [/@llm\/.*/],
    }),
    name: 'node-externals',
    enforce: 'pre',
    apply: 'build',
  };
}
