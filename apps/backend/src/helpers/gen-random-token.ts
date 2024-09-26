import * as crypto from 'node:crypto';

export function genRandomToken(bytes: number) {
  return crypto.randomBytes(bytes).toString('hex');
}
