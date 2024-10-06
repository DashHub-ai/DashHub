import { genRandomBetweenInclusive } from '@llm/commons';

const RANDOM_PASSWORD_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?';

export function genRandomPassword(
  length: number = genRandomBetweenInclusive(20, 32),
): string {
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * RANDOM_PASSWORD_CHARACTERS.length);
    password += RANDOM_PASSWORD_CHARACTERS[randomIndex];
  }
  return password;
}
