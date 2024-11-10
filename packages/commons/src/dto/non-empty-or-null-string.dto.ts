import { z } from 'zod';

export const NonEmptyOrNullStringV = z
  .string()
  .transform(val => val?.trim() || null)
  .nullable();

export type NonEmptyOrNullStringT = z.infer<typeof NonEmptyOrNullStringV>;
