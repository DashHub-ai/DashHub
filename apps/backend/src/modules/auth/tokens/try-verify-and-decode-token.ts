import { either as E } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import jwtSimple from 'jwt-simple';

import { tryParseUsingZodSchema } from '@dashhub/commons';
import { SdkInvalidJwtTokenError, SdkJwtTokenV } from '@dashhub/sdk';

export function tryVerifyAndDecodeToken(secret: string, token: string) {
  if (!token) {
    return E.left(
      new SdkInvalidJwtTokenError(
        {
          message: 'It looks like token is missing. Please try again with a valid token.',
        },
      ),
    );
  }

  return pipe(
    E.tryCatch(
      () => jwtSimple.decode(token, secret, false, 'HS256'),
      () => new SdkInvalidJwtTokenError(
        {
          message: 'It looks like token is expired or invalid. Please try again with a valid token.',
        },
      ),
    ),
    E.chainW(tryParseUsingZodSchema(SdkJwtTokenV)),
    E.mapLeft(() => new SdkInvalidJwtTokenError(
      {
        message: 'It looks like there is an issue with the token format. Please try again with a valid token.',
      },
    )),
  );
}
