import { v4 } from 'uuid';
import { z } from 'zod';

export const SdkTableRowUuidV = z.coerce.string().transform(
  // Fix quirk, coercing `undefined` string results in `undefined` value.
  // It's better to generate a new UUID in this case.
  value => value === 'undefined'
    ? v4()
    : value,
);

export type SdkTableRowUuidT = z.infer<typeof SdkTableRowUuidV>;
