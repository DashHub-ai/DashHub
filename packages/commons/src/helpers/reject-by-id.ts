import type { ObjectWithId } from '../types';

export function rejectById<K extends string | number>(id: K) {
  return <O extends ObjectWithId>(array: O[]) =>
    array.filter(arrayItem => arrayItem.id !== id);
}
