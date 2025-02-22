import type { RecordIndexKey } from '~/types';

export function pluck<K extends RecordIndexKey>(key: K) {
  return <O extends { [NK in K]: any }>(items: O[]): Array<O[K]> =>
    items.map(item => item[key]);
}

export function pluckTyped<O extends Record<string, any>, const K extends keyof O>(key: K) {
  return (items: O[]): Array<O[K]> =>
    items.map(item => item[key]);
}
