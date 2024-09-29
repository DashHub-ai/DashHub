import * as O from 'fp-ts/lib/Option';

export function tryParseJSON<T>(data: string) {
  return O.tryCatch(() => JSON.parse(data) as T);
}
