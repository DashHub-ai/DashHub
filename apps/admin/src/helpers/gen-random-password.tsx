import { genRandomBetweenInclusive } from '@llm/commons';

const RANDOM_PASSWORD_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?';

export function genRandomPassword(
  length: number = genRandomBetweenInclusive(20, 32),
): string {
  let password = '';
  for (let i = 0; i < length; i++) {
    let randomIndex;
    while (true) {
      const randomValue = window.crypto.getRandomValues(new Uint32Array(1))[0];
      if (randomValue < Math.floor(4294967296 / RANDOM_PASSWORD_CHARACTERS.length) * RANDOM_PASSWORD_CHARACTERS.length) {
        randomIndex = randomValue % RANDOM_PASSWORD_CHARACTERS.length;
        break;
      }
    }

    password += RANDOM_PASSWORD_CHARACTERS[randomIndex];
  }
  return password;
}
