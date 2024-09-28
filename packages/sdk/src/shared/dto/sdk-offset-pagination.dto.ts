import { z } from 'zod';

/**
 * Defines the schema for offset-based pagination input using Zod.
 */
export const SdkOffsetPaginationInputV = z.object({
  offset: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional().default(20),
});

export type SdkOffsetPaginationInputT = z.infer<typeof SdkOffsetPaginationInputV>;

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
