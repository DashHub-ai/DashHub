import { createContext } from 'react';

import { useContextOrThrow } from '@llm/commons-front';

import type { I18N_FORWARDED_EN_PACK } from './packs';

export type I18nForwardedContextValue = {
  pack: typeof I18N_FORWARDED_EN_PACK;
};

export const I18nForwardedContext = createContext<I18nForwardedContextValue | null>(null);

export const useForwardedI18n = () => useContextOrThrow(I18nForwardedContext, 'Missing I18nForwardedContext provider!');
