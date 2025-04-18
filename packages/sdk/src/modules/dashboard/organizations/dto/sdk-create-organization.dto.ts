import type { z } from 'zod';

import { SdkTableRowWithIdV, ZodOmitArchivedFields, ZodOmitDateFields } from '~/shared';

import { SdkUpsertOrganizationAISettingsInputV } from './ai-settings';
import { SdkOrganizationV } from './sdk-organization.dto';

export const SdkCreateOrganizationInputV = SdkOrganizationV.omit({
  ...ZodOmitDateFields,
  ...ZodOmitArchivedFields,
  id: true,
  aiSettings: true,
})
  .extend({
    aiSettings: SdkUpsertOrganizationAISettingsInputV,
  });

export type SdkCreateOrganizationInputT = z.infer<typeof SdkCreateOrganizationInputV>;

export const SdkCreateOrganizationOutputV = SdkTableRowWithIdV;

export type SdkCreateOrganizationOutputT = z.infer<typeof SdkCreateOrganizationOutputV>;
