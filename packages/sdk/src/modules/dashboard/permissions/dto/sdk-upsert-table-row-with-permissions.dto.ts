import { z } from 'zod';

import { SdkUpsertPermissionsV } from './sdk-upsert-permission.dto';

export const SdkUpsertTableRowWithPermissionsInputV = z.object({
  permissions: SdkUpsertPermissionsV.nullable().optional(),
});

export type SdkUpsertTableRowWithPermissionsInputT = z.infer<typeof SdkUpsertTableRowWithPermissionsInputV>;
