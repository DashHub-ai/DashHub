import { option as O } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';

import { useLocalStorageObject, useRefSafeCallback } from '@llm/commons-front';
import { type SdkJwtTokensPairT, SdkJwtTokensPairV, type SessionTokensSetterAttrs } from '~/modules';
import { TokensStorage } from '~/modules/auth/storage';

export type TokensStorageAttrs = {
  storageKey: string;
};

export function useSdkBrowserTokensStorage({ storageKey }: TokensStorageAttrs) {
  const localStorage = useLocalStorageObject(storageKey, {
    schema: SdkJwtTokensPairV,
  });

  const getTokensStorage = useRefSafeCallback((): TokensStorage => {
    class FrontSdkStorage extends TokensStorage {
      private localTokensMemory: SdkJwtTokensPairT | null = null;

      setSessionTokens(tokens: SessionTokensSetterAttrs) {
        this.localTokensMemory = null;

        if (!tokens) {
          localStorage.clear();
          return;
        }

        const {
          remember = O.isSome(localStorage.get()),
          refreshToken,
          token,
        } = tokens;

        const truncatedTokens = {
          refreshToken,
          token,
        };

        if (remember) {
          localStorage.set(truncatedTokens);
        }
        else {
          this.localTokensMemory = truncatedTokens;
        }
      }

      getSessionTokens() {
        return pipe(
          O.fromNullable(this.localTokensMemory),
          O.orElse(() => localStorage.get()),
        );
      }
    };

    return new FrontSdkStorage();
  });

  return {
    tokensRevision: localStorage.revision,
    getTokensStorage,
  };
}
