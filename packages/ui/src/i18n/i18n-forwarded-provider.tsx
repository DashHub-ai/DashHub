import type { PropsWithChildren } from 'react';

import { I18nForwardedContext, type I18nForwardedContextValue } from './i18n-forwarded-context';

type Props = PropsWithChildren & {
  value: I18nForwardedContextValue;
};

export function I18nForwardedProvider({ children, value }: Props) {
  return (
    <I18nForwardedContext.Provider value={value}>
      {children}
    </I18nForwardedContext.Provider>
  );
}
