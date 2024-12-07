import type { z } from 'zod';

import { SdkTableRowWithIdV, ZodOmitArchivedFields, ZodOmitDateFields } from '~/shared';

import { SdkAppV } from './sdk-app.dto';

export const SdkCreateAppInputV = SdkAppV.omit({
  ...ZodOmitDateFields,
  ...ZodOmitArchivedFields,
  id: true,
  organization: true,
  category: true,
}).extend({
  organization: SdkTableRowWithIdV,
  category: SdkTableRowWithIdV,
});

export type SdkCreateAppInputT = z.infer<typeof SdkCreateAppInputV>;

export const SdkCreateAppOutputV = SdkTableRowWithIdV;

export type SdkCreateAppOutputT = z.infer<typeof SdkCreateAppOutputV>;
