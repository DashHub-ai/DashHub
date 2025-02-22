import type { ObjectWithId } from '../types';

export function pluckIds<O extends ObjectWithId>(items: O[]): Array<O['id']> {
  return items.map(({ id }) => id);
}
