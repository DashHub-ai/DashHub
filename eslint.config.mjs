import path from 'node:path';

import antfu from '@antfu/eslint-config';

export function createAntfuEslintConfig(options) {
  return antfu({
    react: true,
    ignores: [
      'dist',
      'build',
      '**/*/dist',
      '**/*/build',
      'node_modules',
    ],
    languageOptions: {
      parserOptions: {
        project: path.join(import.meta.dirname, 'tsconfig.eslint.json'),
      },
    },
    typescript: {
      overrides: {
        'ts/no-unsafe-function-type': 0,
        '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
        '@typescript-eslint/no-floating-promises': 'error',
      },
    },
    stylistic: {
      semi: true,
      overrides: {
        'style/member-delimiter-style': [
          'error',
          {
            multiline: {
              delimiter: 'semi',
              requireLast: true,
            },
            singleline: {
              delimiter: 'semi',
              requireLast: true,
            },
            multilineDetection: 'brackets',
          },
        ],
      },
    },
    ...options,
  })
    .override('antfu/react/rules', {
      rules: {
        'react-hooks/exhaustive-deps': 0,
        'react-refresh/only-export-components': 0,
        'react/no-unstable-default-props': 0,
      },
    })
    .override('antfu/imports/rules', {
      rules: {
        'unused-imports/no-unused-imports': 'error',
      },
    })
    .overrideRules({
      'perfectionist/sort-imports': ['error', {
        internalPattern: ['^@/', '^~/', '^\\./', '^@dashhub/'],
        groups: [
          'side-effect',
          'type',
          'builtin',
          'external',
          'internal-type',
          'internal',
          ['parent-type', 'sibling-type', 'index-type'],
          ['parent', 'sibling'],
          'index',
        ],
      }],
    });
}

export default createAntfuEslintConfig();
