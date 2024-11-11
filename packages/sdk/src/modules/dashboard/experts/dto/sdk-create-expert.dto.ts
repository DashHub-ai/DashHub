import type { z } from 'zod';

import { SdkTableRowWithIdV, ZodOmitArchivedFields, ZodOmitDateFields } from '~/shared';

import { SdkExpertV } from './sdk-expert.dto';

export const SdkCreateExpertInputV = SdkExpertV.omit({
  ...ZodOmitDateFields,
  ...ZodOmitArchivedFields,
  id: true,
  organization: true,
})
  .extend({
    organization: SdkTableRowWithIdV,
  });

export type SdkCreateExpertInputT = z.infer<typeof SdkCreateExpertInputV>;

export const SdkCreateExpertOutputV = SdkTableRowWithIdV;

export type SdkCreateExpertOutputT = z.infer<typeof SdkCreateExpertOutputV>;
