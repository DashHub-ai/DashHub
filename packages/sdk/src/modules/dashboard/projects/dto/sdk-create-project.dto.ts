import type { z } from 'zod';

import { SdkTableRowWithIdV, ZodOmitArchivedFields, ZodOmitDateFields } from '~/shared';

import { SdkProjectV } from './sdk-project.dto';

export const SdkCreateProjectInputV = SdkProjectV.omit({
  ...ZodOmitDateFields,
  ...ZodOmitArchivedFields,
  id: true,
  organization: true,
})
  .extend({
    organization: SdkTableRowWithIdV,
  });

export type SdkCreateProjectInputT = z.infer<typeof SdkCreateProjectInputV>;

export const SdkCreateProjectOutputV = SdkTableRowWithIdV;

export type SdkCreateProjectOutputT = z.infer<typeof SdkCreateProjectOutputV>;
