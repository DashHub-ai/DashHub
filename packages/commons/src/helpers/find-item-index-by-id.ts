import type { ObjectWithId } from '../types';

export function findItemIndexById(id: unknown) {
  return <O extends ObjectWithId>(array: O[]) =>
    array.findIndex(arrayItem => arrayItem.id === id);
}
