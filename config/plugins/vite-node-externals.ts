import type { Plugin } from 'vite';

import {
  type ExternalsOptions,
  nodeExternals as rollupNodeExternals,
} from 'rollup-plugin-node-externals';

export function nodeExternals(options?: ExternalsOptions): Plugin {
  return {
    ...rollupNodeExternals(options),
    name: 'node-externals',
    enforce: 'pre',
    apply: 'build',
  };
}
