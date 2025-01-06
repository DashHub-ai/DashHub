import { z } from 'zod';

import {
  SdkAIGeneratedStringInputV,
  SdkTableRowWithIdV,
  ZodOmitArchivedFields,
  ZodOmitDateFields,
} from '~/shared';

import { SdkUpsertTableRowWithPermissionsInputV } from '../../permissions/dto/sdk-upsert-table-row-with-permissions.dto';
import { SdkProjectV } from './sdk-project.dto';

export const SdkProjectSummaryInputV = z.object({
  content: SdkAIGeneratedStringInputV,
});

export type SdkProjectSummaryInputT = z.infer<typeof SdkProjectSummaryInputV>;

export const SdkCreateProjectInputV = SdkProjectV.omit({
  ...ZodOmitDateFields,
  ...ZodOmitArchivedFields,
  id: true,
  organization: true,
  summary: true,
  permissions: true,
  creator: true,
})
  .merge(SdkUpsertTableRowWithPermissionsInputV)
  .extend({
    organization: SdkTableRowWithIdV,
    summary: SdkProjectSummaryInputV,
  });

export type SdkCreateProjectInputT = z.infer<typeof SdkCreateProjectInputV>;

export const SdkCreateProjectOutputV = SdkTableRowWithIdV;

export type SdkCreateProjectOutputT = z.infer<typeof SdkCreateProjectOutputV>;
