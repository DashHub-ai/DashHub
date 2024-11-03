import { type PropsWithChildren, useMemo } from 'react';

import {
  type AbstractNestedSdkWithAuthConfig,
  AuthAsyncFetcher,
  AuthSdk,
  DashboardSdk,
} from '~/modules';

import { type TokensStorageAttrs, useSdkBrowserTokensStorage } from './hooks/use-sdk-browser-tokens-storage';
import { SdkContext, type SdkContextSessionT, type SdkContextT } from './sdk-context';

type SdkProviderProps = PropsWithChildren & {
  apiUrl: string;
  storageKey?: string;
  storageAttrs: TokensStorageAttrs;
};

export function SdkProvider({ children, apiUrl, storageAttrs }: SdkProviderProps) {
  const { tokensRevision, getTokensStorage } = useSdkBrowserTokensStorage(storageAttrs);

  const value = useMemo<SdkContextT>(() => {
    const authSdk = new AuthSdk({
      apiUrl,
      getTokensStorage,
    });

    const nestedAuthSdkConfigWithAUth: AbstractNestedSdkWithAuthConfig = {
      authAsyncFetcher: new AuthAsyncFetcher(authSdk),
      apiUrl,
      getTokensStorage,
    };

    const maybeDecodedToken = getTokensStorage().getDecodedTokenOrNull();
    const session: SdkContextSessionT = maybeDecodedToken
      ? {
          isLoggedIn: true,
          token: maybeDecodedToken,
        }
      : {
          isLoggedIn: false,
        };

    return {
      session,
      sdks: {
        auth: authSdk,
        dashboard: new DashboardSdk(nestedAuthSdkConfigWithAUth),
      },
    };
  }, [tokensRevision, apiUrl]);

  return (
    <SdkContext.Provider value={value}>
      {children}
    </SdkContext.Provider>
  );
}
