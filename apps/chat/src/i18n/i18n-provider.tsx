import { option as O } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { type PropsWithChildren, useMemo } from 'react';
import { z } from 'zod';

import { useLocalStorageObject } from '@dashhub/commons-front';

import { I18N_DEFAULT_LANG, type I18nLangT, I18nLangV } from './dto';
import { I18nContext, type I18nContextValue } from './i18n-context';
import { I18N_PACKS } from './packs';

export function I18nProvider({ children }: PropsWithChildren) {
  const langStorageObject = useLocalStorageObject('i18n-lang', {
    schema: z.object({
      value: I18nLangV,
    }),
  });

  const langOrDefault = pipe(
    langStorageObject.get(),
    O.fold(
      () => I18N_DEFAULT_LANG,
      ({ value }) => value,
    ),
  );

  const setLanguage = (lang: I18nLangT) => {
    langStorageObject.set({
      value: lang,
    });
  };

  const value = useMemo<I18nContextValue>(() => ({
    packs: I18N_PACKS,
    pack: I18N_PACKS[langOrDefault],
    lang: langOrDefault,
    setLanguage,
    getSupportedLanguages: () => Object.keys(I18N_PACKS) as I18nLangT[],
  }), [langOrDefault]);

  return (
    <I18nContext value={value}>
      {children}
    </I18nContext>
  );
}
