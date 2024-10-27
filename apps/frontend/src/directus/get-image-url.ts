import { concatUrlParts } from '@llm/commons';

export function getImageUrl(id: string) {
  return concatUrlParts(import.meta.env.VITE_DIRECTUS_URL, 'assets', `${id}.png`);
}
