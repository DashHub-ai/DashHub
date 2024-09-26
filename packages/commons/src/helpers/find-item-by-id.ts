import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';

import type { ObjectWithId } from '../types';

export function findItemById(id: unknown) {
  return <O extends ObjectWithId>(array: O[]) =>
    array.find(arrayItem => arrayItem.id === id);
}

export function maybeFindItemById(id: unknown) {
  return <O extends ObjectWithId>(array: O[]) =>
    pipe(findItemById(id)(array), O.fromNullable);
}
