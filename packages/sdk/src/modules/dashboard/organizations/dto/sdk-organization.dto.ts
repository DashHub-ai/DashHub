import { z } from 'zod';

import {
  SdkTableRowWithArchivedV,
  SdkTableRowWithDatesV,
  SdkTableRowWithIdV,
} from '~/shared';

import { SdkOrganizationAISettingsV } from './ai-settings';

export const SdkOrganizationV = z.object({
  name: z.string(),
  maxNumberOfUsers: z.number().int().positive(),
  aiSettings: SdkOrganizationAISettingsV,
})
  .merge(SdkTableRowWithIdV)
  .merge(SdkTableRowWithDatesV)
  .merge(SdkTableRowWithArchivedV);

export type SdkOrganizationT = z.infer<typeof SdkOrganizationV>;
