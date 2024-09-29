import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/lib/TaskEither';

import { type EncryptedPassword, tryEncryptPassword } from './try-encrypt-password';

export function tryComparePasswords(password: string) {
  return (encrypted: EncryptedPassword) =>
    pipe(
      tryEncryptPassword(password, encrypted.salt),
      TE.map(({ hash }) => hash === encrypted.hash),
    );
}
