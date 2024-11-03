import { concatUrls } from '@llm/commons';

export function prefixWithBaseRoute(path: string) {
  return concatUrls(import.meta.env.BASE_URL ?? '/', path);
}
