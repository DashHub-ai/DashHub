import { genRandomBetweenInclusive } from '@llm/commons';
import { randomBytes } from 'crypto';

const RANDOM_PASSWORD_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?';

export function genRandomPassword(
  length: number = genRandomBetweenInclusive(20, 32),
): string {
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = randomBytes(1)[0] % RANDOM_PASSWORD_CHARACTERS.length;
    password += RANDOM_PASSWORD_CHARACTERS[randomIndex];
  }
  return password;
}
