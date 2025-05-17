import { pipe } from 'fp-ts/lib/function';

import { tapTaskEither } from '@dashhub/commons';
import { performApiRequest, postPayload } from '~/shared';

import type {
  SdkEmailLoginInputT,
  SdkPasswordLoginInputT,
  SdkPasswordLoginOutputT,
  SdkRefreshJWTInputT,
  SdkRefreshTokenOutputT,
} from './dto';
import type {
  SdkIncorrectUsernameError,
  SdkIncorrectUsernameOrPasswordError,
  SdkInvalidJwtRefreshTokenError,
} from './errors';

import { AbstractNestedSdk } from '../abstract-nested-sdk';
import { AuthAsyncFetcher } from './auth-async-fetcher';

export class AuthSdk extends AbstractNestedSdk {
  protected endpointPrefix = '/auth';

  authFetcher = new AuthAsyncFetcher(this);

  logOut = () => {
    this.tokensStorage.clearSessionTokens();
  };

  passwordLogin = ({ remember, ...data }: SdkPasswordLoginInputT) =>
    pipe(
      performApiRequest<SdkPasswordLoginOutputT, SdkIncorrectUsernameOrPasswordError>({
        url: this.endpoint('/login/password'),
        options: postPayload(data),
      }),
      tapTaskEither((tokens) => {
        this.tokensStorage.setSessionTokens({
          ...tokens,
          remember,
        });
      }),
    );

  emailLogin = (data: SdkEmailLoginInputT) =>
    performApiRequest<void, SdkIncorrectUsernameError>({
      url: this.endpoint('/login/email'),
      options: postPayload(data),
    });

  rawRefreshToken = (data: SdkRefreshJWTInputT) =>
    performApiRequest<SdkRefreshTokenOutputT, SdkInvalidJwtRefreshTokenError>({
      url: this.endpoint('/login/refresh'),
      options: postPayload(data),
    });
}
