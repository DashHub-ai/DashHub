import { either as E } from 'fp-ts';
import { pipe } from 'fp-ts/function';
import { jwtDecode } from 'jwt-decode';

import { TaggedError, tryParseUsingZodSchema } from '@llm/commons';

import { JWTTokenV } from '../dto';

export function tryDecodeToken(token: string) {
  return pipe(
    E.tryCatch(
      () => jwtDecode(token),
      (err: any) => new DecodeTokenFormatError(err),
    ),
    E.chainW(tryParseUsingZodSchema(JWTTokenV)),
  );
}

export class DecodeTokenFormatError extends TaggedError.ofLiteral<Error>()('DecodeTokenFormatError') {}
