import type { z } from 'zod';

import { SdkTableRowWithIdV, ZodOmitArchivedFields, ZodOmitDateFields } from '~/shared';

import { SdkUpsertTableRowWithPermissionsInputV } from '../../permissions/dto/sdk-upsert-table-row-with-permissions.dto';
import { SdkProjectSummaryInputV } from './sdk-create-project.dto';
import { SdkProjectV } from './sdk-project.dto';

export const SdkUpdateProjectInputV = SdkProjectV.omit({
  ...ZodOmitDateFields,
  ...ZodOmitArchivedFields,
  id: true,
  organization: true,
  summary: true,
})
  .merge(SdkUpsertTableRowWithPermissionsInputV)
  .extend({
    summary: SdkProjectSummaryInputV,
  });

export type SdkUpdateProjectInputT = z.infer<typeof SdkUpdateProjectInputV>;

export const SdkUpdateProjectOutputV = SdkTableRowWithIdV;

export type SdkUpdateProjectOutputT = z.infer<typeof SdkUpdateProjectOutputV>;
