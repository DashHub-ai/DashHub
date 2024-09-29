import * as A from 'fp-ts/lib/Array';
import { pipe } from 'fp-ts/lib/function';
import { toEntries } from 'fp-ts/lib/Record';

import type { CanBeArray, Nullable } from '../../types';

import { isNil } from '../is-nil';

export type SearchParamValue = string | number | boolean | Date | null;

export type SearchParamsMap = Record<
  string,
  Nullable<CanBeArray<SearchParamValue>>
>;

export function encodeSearchParams(query: SearchParamsMap) {
  return pipe(
    toEntries(query),
    A.chain<[string, any], [string, any]>(([key, value]) => {
      if (isNil(value)) {
        return [];
      }

      if (Array.isArray(value)) {
        return value.map(nestedValue => [`${key}[]`, nestedValue]);
      }

      return [[key, value]];
    }),
    A.reduce(new URLSearchParams(), (acc, [key, value]) => {
      const parsedValue = value instanceof Date ? value.toISOString() : value;

      acc.append(key, parsedValue);
      return acc;
    }),
    obj => obj.toString(),
  );
}
