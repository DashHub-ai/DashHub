import * as E from 'fp-ts/Either';

import type { JWTTokenT } from '../dto';

import { tryDecodeToken } from './try-decode-token';

export function ofUnsafeToken(token: string | JWTTokenT) {
  return typeof token === 'string' ? tryDecodeToken(token) : E.of(token);
}
