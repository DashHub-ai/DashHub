import { either as E } from 'fp-ts';
import { pipe } from 'fp-ts/function';
import jwtSimple from 'jwt-simple';

import { tryParseUsingZodSchema } from '@llm/commons';
import { SdkJwtTokenV, SdkUnauthorizedError } from '@llm/sdk';

export function tryVerifyAndDecodeToken(secret: string, token: string) {
  return pipe(
    E.tryCatch(
      () => jwtSimple.decode(token, secret, false, 'HS256'),
      () => new SdkUnauthorizedError({
        message: '401 - Unauthorized! Your token is invalid!',
      }),
    ),
    tryParseUsingZodSchema(SdkJwtTokenV),
  );
}
