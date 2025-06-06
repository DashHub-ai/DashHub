import { either as E } from 'fp-ts';
import { createMiddleware } from 'hono/factory';

import type { SdkJwtTokenT } from '@dashhub/sdk';

import { tryVerifyAndDecodeToken } from '~/modules/auth';

import { respondWithTaggedError } from '../helpers';

export type JWTVariables = {
  jwt: SdkJwtTokenT;
};

export function jwtMiddleware(jwtSecret: string) {
  return createMiddleware<{ Variables: JWTVariables; }>(async (context, next) => {
    const token = context.req.raw.headers.get('Authorization')?.replace('Bearer', '').trim();
    const decodeResult = tryVerifyAndDecodeToken(jwtSecret, token ?? '');

    if (E.isLeft(decodeResult)) {
      return respondWithTaggedError(context, 401)(decodeResult.left);
    }

    context.set('jwt', decodeResult.right);

    await next();
  });
}
