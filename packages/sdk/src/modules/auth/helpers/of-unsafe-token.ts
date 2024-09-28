import * as E from 'fp-ts/Either';

import type { SdkJwtTokenT } from '../dto';

import { tryDecodeToken } from './try-decode-token';

export function ofUnsafeToken(token: string | SdkJwtTokenT) {
  return typeof token === 'string' ? tryDecodeToken(token) : E.of(token);
}
