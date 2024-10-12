import { z } from 'zod';

export const StrictBooleanV = z
  .union([
    z.boolean(),
    z.literal('true'),
    z.literal('false'),
  ])
  .transform(value => value === true || value === 'true');

export const StrictNullableBooleanV = z.union([
  StrictBooleanV,
  z.union([
    z.literal('null'),
    z.null(),
  ])
    .transform(() => null),
]);
