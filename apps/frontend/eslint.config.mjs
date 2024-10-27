import { createAntfuEslintConfig } from '../../eslint.config.mjs';

export default createAntfuEslintConfig({
  astro: true,
})
  .overrideRules({
    'antfu/no-top-level-await': 'off',
  });
