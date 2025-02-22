import type { Reader } from 'fp-ts/Reader';

import type { RecordIndexKey } from '~/types';

export function groupByFlat<A, B extends string>(fn: Reader<A, B>) {
  return (array: readonly A[]) =>
    array.reduce<Record<B, A>>((acc, item) => {
      acc[fn(item)] = item;
      return acc;
    }, Object.create({}) as unknown as any);
}

export function groupByFlatProp<
  O extends Record<RecordIndexKey, any>,
  K extends RecordIndexKey = keyof O,
>(key: K) {
  return groupByFlat<O, string>(item => item[key]);
}
