import { either as E } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { jwtDecode } from 'jwt-decode';

import { TaggedError, tryParseUsingZodSchema } from '@dashhub/commons';

import { SdkJwtTokenV } from '../dto';

export function tryDecodeToken(token: string) {
  return pipe(
    E.tryCatch(
      () => jwtDecode(token),
      (err: any) => new SdkDecodeTokenFormatError(err),
    ),
    E.chainW(tryParseUsingZodSchema(SdkJwtTokenV)),
    E.mapLeft(err => new SdkDecodeTokenFormatError(err)),
  );
}

export class SdkDecodeTokenFormatError extends TaggedError.ofLiteral<Error>()('SdkDecodeTokenFormatError') {}
