import type { UserConfig } from '@commitlint/types';

import { commitlintScopePlugin } from './config/commitlint-scope';

export default {
  plugins: [commitlintScopePlugin as any],
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [2, 'always', ['global']],
  },
} satisfies UserConfig;
