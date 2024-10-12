import * as A from 'fp-ts/lib/Array';
import { pipe } from 'fp-ts/lib/function';
import { toEntries } from 'fp-ts/lib/Record';

import type { CanBeArray, Nullable } from '../../types';

export type SearchParamValue = string | number | boolean | Date | null;

export type SearchParamsMap = Record<
  string,
  Nullable<CanBeArray<SearchParamValue>>
>;

export function encodeSearchParams(query: SearchParamsMap) {
  return pipe(
    toEntries(query),
    A.chain<[string, any], [string, any]>(([key, value]) => {
      // `null` is a valid value for a query parameter, but `undefined` is not.
      // Take a look at the `StrictNullableBooleanV` in typings.
      if (value === undefined) {
        return [];
      }

      if (Array.isArray(value)) {
        return value.map(nestedValue => [key, nestedValue]);
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
