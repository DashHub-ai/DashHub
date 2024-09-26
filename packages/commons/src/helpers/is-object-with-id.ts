import type { ObjectWithId } from '../types';

import { isNil } from './is-nil';

export function isRelaxedObjectWithID(obj: any): obj is ObjectWithId {
  return !isNil(obj?.id);
}

export function isObjectWithID<T extends { id?: any; }>(obj: T): obj is T & { id: Required<NonNullable<T['id']>>; } {
  return !isNil(obj?.id);
}
