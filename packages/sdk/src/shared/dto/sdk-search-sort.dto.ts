import { z } from 'zod';

import type { SdkTableRowWithDatesT } from './sdk-table-row-with-dates.dto';

export type SdkSearchSortDirectionT = 'asc' | 'desc';

export type SdkSortItemT<N extends string = string> = `${N}:${SdkSearchSortDirectionT}`;

export const DEFAULT_SDK_SORT = [
  'score:desc',
  'score:asc',

  'createdAt:desc',
  'createdAt:asc',

  'updatedAt:desc',
  'updatedAt:asc',

  'id:desc',
  'id:asc',
] as const satisfies [SdkSortItemT, ...SdkSortItemT[]];

export function SdkSortV<const T extends [SdkSortItemT, ...SdkSortItemT[]]>(values: T) {
  return z.enum(values).default(values[0]).optional();
}

export function SdkSortInputV<const T extends [SdkSortItemT, ...SdkSortItemT[]]>(values: T) {
  return z.object({
    sort: SdkSortV(values),
  });
}

export const SdkDefaultSortInputV = SdkSortInputV(DEFAULT_SDK_SORT);

export function destructSdkSortItem<S extends string>(sort: SdkSortItemT<S>) {
  const [name, direction] = sort.split(':');

  return {
    name,
    direction,
  } as { name: S; direction: SdkSearchSortDirectionT; };
}

export function sortSdkRecordsWithDates<T extends SdkTableRowWithDatesT & { id?: string | number; }>(
  sort: SdkSortItemT<'createdAt' | 'updatedAt' | 'id'>,
) {
  const { name, direction } = destructSdkSortItem(sort);

  return (records: T[]) => [...records].sort((a, b) => {
    let comparison = 0;

    switch (name) {
      case 'createdAt':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;

      case 'updatedAt':
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        break;

      case 'id':
        if (a.id !== undefined && b.id !== undefined) {
          comparison = String(a.id).localeCompare(String(b.id));
        }
        break;
    }

    return direction === 'asc' ? comparison : -comparison;
  });
}
