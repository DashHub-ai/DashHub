import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';

import { type EncryptedPassword, tryEncryptPassword } from './try-encrypt-password';

export function tryComparePasswords(password: string) {
  return (encrypted: EncryptedPassword) =>
    pipe(
      tryEncryptPassword(password, encrypted.salt),
      TE.map(({ hash }) => hash === encrypted.hash),
    );
}
