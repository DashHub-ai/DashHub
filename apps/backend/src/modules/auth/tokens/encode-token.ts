import jwtSimple from 'jwt-simple';

import type { JWTTokenT } from '@llm/sdk';

export function encodeToken(jwtToken: JWTTokenT, secret: string) {
  return jwtSimple.encode(jwtToken, secret, 'HS256');
}
