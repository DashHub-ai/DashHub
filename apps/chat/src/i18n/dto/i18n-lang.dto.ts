import { z } from 'zod';

import { fallback } from '@dashhub/commons';

export const I18nLangV = z.enum(['en', 'pl']).or(fallback('en'));

export const I18N_DEFAULT_LANG = I18nLangV.parse(
  navigator.language.split('-')[0].toLowerCase(),
);

export type I18nLangT = z.infer<typeof I18nLangV>;

export function parseI18nLang(lang: string) {
  return I18nLangV.parse(lang);
}
