import { type I18nLangT, parseI18nLang } from '../dto';
import { I18N_PACK_EN } from './i18n-lang-en';
import { I18N_PACK_PL } from './i18n-lang-pl';

export type I18nLangPack = typeof I18N_PACK_EN;

export type I18nLangPacks = Record<I18nLangT, I18nLangPack>;

export const I18N_PACKS: I18nLangPacks = {
  en: I18N_PACK_EN,
  pl: I18N_PACK_PL,
};

export function getI18nPackByUnsafeLang(lang: string) {
  return I18N_PACKS[parseI18nLang(lang)];
}
