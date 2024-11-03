import { createContext, useContext } from 'react';

import type { I18nLangT } from './dto';

import {
  I18N_PACKS,
  type I18nLangPack,
  type I18nLangPacks,
} from './packs';

export type I18nContextValue = {
  lang: I18nLangT;
  packs: I18nLangPacks;
  pack: I18nLangPack;
  setLanguage: (lang: I18nLangT) => void;
  getSupportedLanguages: () => I18nLangT[];
};

export const I18nContext = createContext<I18nContextValue>({
  lang: 'en',
  packs: I18N_PACKS,
  pack: I18N_PACKS.en,
  setLanguage: () => {},
  getSupportedLanguages: () => Object.keys(I18N_PACKS) as I18nLangT[],
});

export const useI18n = () => useContext(I18nContext);
