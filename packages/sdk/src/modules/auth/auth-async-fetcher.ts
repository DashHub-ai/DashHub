import { type either as E, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';

import { type TaggedError, tapTaskEither } from '@llm/commons';
import { type APIRequestAttrs, performApiRequest, type SdkApiRequestErrors } from '~/shared';

import type { AuthSdk } from './auth.sdk';
import type { SdkJwtTokensPairT } from './dto';
import type { SdkNoTokensInStorageError } from './storage';

import { shouldRefreshToken } from './helpers';

export class AuthAsyncFetcher {
  private refreshTokenLock: Promise<E.Either<SdkApiRequestErrors, SdkJwtTokensPairT>> | null = null;

  constructor(private readonly authSdk: AuthSdk) {}

  get tokensStorage() {
    return this.authSdk.tokensStorage;
  }

  fetchWithAuthTokenTE = <A, E extends TaggedError<string, any> = never>(
    attrs: Omit<APIRequestAttrs, 'token'>,
  ) =>
    pipe(
      this.getRefreshedToken(),
      TE.chainW(maybeTokens =>
        performApiRequest<A, E>({
          ...attrs,
          authToken: maybeTokens?.token,
        }),
      ),
    );

  private readonly getRefreshedToken = () =>
    pipe(
      TE.Do,
      TE.bind('tokens', () => this.tokensStorage.getSessionTokensTE()),
      TE.bindW('shouldRefresh', ({ tokens }) =>
        TE.fromEither(shouldRefreshToken(tokens.token))),
      TE.chain(({ tokens, shouldRefresh }): TE.TaskEither<
        SdkNoTokensInStorageError | SdkApiRequestErrors,
        SdkJwtTokensPairT
      > => {
        if (!shouldRefresh) {
          return TE.of(tokens);
        }

        return this.unsafeLockAndRefreshToken(tokens.refreshToken);
      }),
    );

  private readonly unsafeLockAndRefreshToken
    = (refreshToken: string) => async () => {
      this.refreshTokenLock ??= pipe(
        this.authSdk.rawRefreshToken({
          refreshToken,
        }),
        tapTaskEither((tokens) => {
          this.refreshTokenLock = null;
          this.tokensStorage.setSessionTokens(tokens);
        }),
      )();

      return this.refreshTokenLock;
    };
}
