import { z } from 'zod';

export type SdkSearchSortDirectionT = 'asc' | 'desc';

export type SdkSortItemT<N extends string = string> = `${N}:${SdkSearchSortDirectionT}`;

export const DEFAULT_SDK_SORT = [
  'createdAt:desc',
  'createdAt:asc',

  'updatedAt:desc',
  'updatedAt:asc',

  'id:desc',
  'id:asc',
] as const satisfies [SdkSortItemT, ...SdkSortItemT[]];

export function SdkSortInputV<const T extends [SdkSortItemT, ...SdkSortItemT[]]>(values: T) {
  return z.object({
    sort: z
      .enum(values)
      .optional()
      .default(values[0]),
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