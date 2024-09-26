import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';

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
      TE.fromOption(() => new NoTokensInStorageError({})),
    );
  }

  getDecodedToken() {
    return pipe(
      this.getSessionTokens(),
      E.fromOption(() => new NoTokensInStorageError({})),
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

export class NoTokensInStorageError extends TaggedError.ofLiteral<any>()('DecodeTokenFormatError') {}
