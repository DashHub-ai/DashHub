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
    project: true,
    category: true,
    aiModel: true,
  })
  .merge(SdkUpsertTableRowWithPermissionsInputV)
  .extend({
    category: SdkTableRowWithIdV,
    aiModel: SdkTableRowWithIdV.nullable(),
    logo: SdkOptionalFileUploadV,
  });

export type SdkUpdateAppInputT = z.infer<typeof SdkUpdateAppInputV>;

export const SdkUpdateAppOutputV = SdkTableRowWithIdV;

export type SdkUpdateAppOutputT = z.infer<typeof SdkUpdateAppOutputV>;
