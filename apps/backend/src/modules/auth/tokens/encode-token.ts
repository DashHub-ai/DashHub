import jwtSimple from 'jwt-simple';

import type { SdkJwtTokenT } from '@dashhub/sdk';

export function encodeToken(jwtToken: SdkJwtTokenT, secret: string) {
  return jwtSimple.encode(jwtToken, secret, 'HS256');
}
