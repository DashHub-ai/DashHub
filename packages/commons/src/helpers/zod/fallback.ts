import { z, type ZodType } from 'zod';

export function fallback<const T>(value: T): ZodType<T> {
  return z.any().transform(() => value);
}
