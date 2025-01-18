import { z } from 'zod';

import { SdkTableRowWithIdV, ZodOmitArchivedFields, ZodOmitDateFields } from '~/shared';

import { SdkUpsertTableRowWithPermissionsInputV } from '../../permissions/dto/sdk-upsert-table-row-with-permissions.dto';
import { SdkAppV } from './sdk-app.dto';

export const SdkCreateAppInputV = SdkAppV.omit({
  ...ZodOmitDateFields,
  ...ZodOmitArchivedFields,
  id: true,
  organization: true,
  category: true,
})
  .merge(SdkUpsertTableRowWithPermissionsInputV)
  .extend({
    organization: SdkTableRowWithIdV,
    category: SdkTableRowWithIdV,
    logo: z.instanceof(File).optional().nullable(),
  });

export type SdkCreateAppInputT = z.infer<typeof SdkCreateAppInputV>;

export const SdkCreateAppOutputV = SdkTableRowWithIdV;

export type SdkCreateAppOutputT = z.infer<typeof SdkCreateAppOutputV>;
