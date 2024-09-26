import process from 'node:process';

import * as ensure from '@commitlint/ensure';
import { getPackagesSync } from '@manypkg/get-packages';

function getPackagesNonPrefixedNames(context: { cwd?: string; }) {
  const cwd = context.cwd || process.cwd();
  const packages = getPackagesSync(cwd);

  return packages.packages.map(p =>
    p.packageJson.name.replace(/@[^/]+\//, ''),
  );
}

export const commitlintScopePlugin = {
  rules: {
    'scope-enum': (
      parsed: any,
      when: 'always' | 'never' = 'always',
      value: string[] = [],
    ) => {
      const packages = getPackagesNonPrefixedNames(parsed);
      const scopes = value.concat(packages);
      const negated = when === 'never';
      const result = ensure.enum(parsed.scope, scopes);

      return [
        negated ? !result : result,
        [
          'scope must',
          negated ? 'not' : null,
          `be one of [${scopes.join(', ')}]`,
        ]
          .filter(Boolean)
          .join(' '),
      ];
    },
  },
};
