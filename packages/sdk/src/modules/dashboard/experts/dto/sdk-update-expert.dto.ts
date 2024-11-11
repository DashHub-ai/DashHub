import type { z } from 'zod';

import { SdkTableRowWithIdV, ZodOmitArchivedFields, ZodOmitDateFields } from '~/shared';

import { SdkExpertV } from './sdk-expert.dto';

export const SdkUpdateExpertInputV = SdkExpertV.omit({
  ...ZodOmitDateFields,
  ...ZodOmitArchivedFields,
  id: true,
  organization: true,
});

export type SdkUpdateExpertInputT = z.infer<typeof SdkUpdateExpertInputV>;

export const SdkUpdateExpertOutputV = SdkTableRowWithIdV;

export type SdkUpdateExpertOutputT = z.infer<typeof SdkUpdateExpertOutputV>;
