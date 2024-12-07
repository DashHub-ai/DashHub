import type { z } from 'zod';

import { SdkTableRowWithIdV, ZodOmitArchivedFields, ZodOmitDateFields } from '~/shared';

import { SdkAppV } from './sdk-app.dto';

export const SdkUpdateAppInputV = SdkAppV
  .omit({
    ...ZodOmitDateFields,
    ...ZodOmitArchivedFields,
    id: true,
    organization: true,
    category: true,
  })
  .extend({
    category: SdkTableRowWithIdV,
  });

export type SdkUpdateAppInputT = z.infer<typeof SdkUpdateAppInputV>;

export const SdkUpdateAppOutputV = SdkTableRowWithIdV;

export type SdkUpdateAppOutputT = z.infer<typeof SdkUpdateAppOutputV>;
