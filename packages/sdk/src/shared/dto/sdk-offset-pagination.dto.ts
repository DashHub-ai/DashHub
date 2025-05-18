import { z } from 'zod';

import type { Overwrite } from '@dashhub/commons';

/**
 * Defines the schema for offset-based pagination input using Zod.
 */
export const SdkOffsetPaginationInputV = z.object({
  offset: z.coerce.number().int().nonnegative().optional().default(0),
  limit: z.coerce.number().int().positive().optional().default(20),
});

export type SdkOffsetPaginationInputT = z.infer<typeof SdkOffsetPaginationInputV>;

export type SdkOmitOffsetPaginationInputT<K> = Omit<K, keyof SdkOffsetPaginationInputT>;

/**
 * Defines the schema for offset-based pagination output using Zod.
 */
export function SdkOffsetPaginationOutputV<T extends z.ZodType<any, any>>(item: T) {
  return z.object({
    items: z.array(item),
    total: z.number().int().positive(),
  });
}

export type SdkOffsetPaginationOutputT<T> = {
  items: T[];
  total: number;
};

export type SdkInferOffsetPaginationItemType<T> =
  T extends SdkOffsetPaginationOutputT<infer R> ? R : never;

export function mapSdkOffsetPaginationItems<
  P extends SdkOffsetPaginationOutputT<unknown>,
  K,
>(
  mapperFn: (item: P['items'][number]) => K,
) {
  return ({ items, ...pagination }: P): Overwrite<P, { items: K[]; }> => ({
    ...pagination,
    items: items.map(mapperFn),
  });
}

export function offsetSdkPaginateArray<T>(pagination: SdkOffsetPaginationInputT) {
  return (array: T[]): SdkOffsetPaginationOutputT<T> => {
    const { offset, limit } = pagination;
    const paginatedArray = array.slice(offset, offset + limit);

    return {
      items: paginatedArray,
      total: array.length,
    };
  };
}
