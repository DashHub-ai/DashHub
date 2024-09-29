import * as E from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/lib/Option';
import * as TE from 'fp-ts/lib/TaskEither';

import { type Nullable, TaggedError } from '@llm/commons';

import type { SdkJwtTokensPairT } from '../dto';

import { tryDecodeToken } from '../helpers';

export type SessionTokensSetterAttrs = Nullable<
  SdkJwtTokensPairT & { remember?: boolean; }
>;

export abstract class TokensStorage {
  abstract getSessionTokens(): O.Option<SdkJwtTokensPairT>;

  abstract setSessionTokens(tokens: SessionTokensSetterAttrs): void;

  hasSessionTokens() {
    return O.isSome(this.getSessionTokens());
  }

  getSessionTokensTE() {
    return pipe(
      this.getSessionTokens(),
      TE.fromOption(() => new SdkNoTokensInStorageError({})),
    );
  }

  getDecodedToken() {
    return pipe(
      this.getSessionTokens(),
      E.fromOption(() => new SdkNoTokensInStorageError({})),
      E.chain(({ token }) => tryDecodeToken(token)),
    );
  }

  getDecodedTokenOrNull() {
    return pipe(
      this.getDecodedToken(),
      E.getOrElseW(() => null),
    );
  }

  clearSessionTokens(): void {
    this.setSessionTokens(null);
  }
}

export class SdkNoTokensInStorageError extends TaggedError.ofLiteral<any>()('SdkDecodeTokenFormatError') {}
