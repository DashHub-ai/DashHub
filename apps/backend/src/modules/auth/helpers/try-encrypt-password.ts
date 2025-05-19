import bcryptjs from 'bcryptjs';

import { TaggedError } from '@dashhub/commons';

export const SALT_ROUNDS = 10;

export type EncryptedPassword = {
  salt: string;
  hash: string;
};

export function tryEncryptPassword(password: string, defaultSalt?: string) {
  return TaggedError.tryUnsafeTask(EncryptPasswordError, async () => {
    const salt = defaultSalt ?? (await bcryptjs.genSalt(SALT_ROUNDS));
    const hash = await bcryptjs.hash(password, salt);

    return {
      salt,
      hash,
    };
  });
}

export class EncryptPasswordError extends TaggedError.ofLiteral()('EncryptPasswordError') {}
