import type { z } from 'zod';

import {
  SdkOptionalFileUploadV,
  SdkTableRowWithIdV,
  ZodOmitArchivedFields,
  ZodOmitDateFields,
} from '~/shared';

import { SdkUpsertTableRowWithPermissionsInputV } from '../../permissions/dto/sdk-upsert-table-row-with-permissions.dto';
import { SdkAppV } from './sdk-app.dto';

export const SdkUpdateAppInputV = SdkAppV
  .omit({
    ...ZodOmitDateFields,
    ...ZodOmitArchivedFields,
    id: true,
    organization: true,
    category: true,
  })
  .merge(SdkUpsertTableRowWithPermissionsInputV)
  .extend({
    category: SdkTableRowWithIdV,
    logo: SdkOptionalFileUploadV,
  });

export type SdkUpdateAppInputT = z.infer<typeof SdkUpdateAppInputV>;

export const SdkUpdateAppOutputV = SdkTableRowWithIdV;

export type SdkUpdateAppOutputT = z.infer<typeof SdkUpdateAppOutputV>;
