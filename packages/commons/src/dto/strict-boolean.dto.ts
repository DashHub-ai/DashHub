import { z } from 'zod';

export const StrictBooleanV = z
  .union([
    z.boolean(),
    z.literal('true'),
    z.literal('false'),
  ])
  .transform(value => value === true || value === 'true');
