import { z } from 'zod';

import { SdkTableRowWithDatesV, SdkTableRowWithIdNameV, SdkTableRowWithIdV } from '~/shared';

import { SdkTableRowWithPermissionsV } from '../../permissions/dto/sdk-table-row-with-permissions.dto';
import { SdkBaseS3ResourceV } from '../../s3-files';

export const SdkProjectEmbeddingV = z.object({
  text: z.string(),
  organization: SdkTableRowWithIdV,
  projectFile: SdkTableRowWithIdNameV.extend({
    resource: SdkBaseS3ResourceV.pick({
      id: true,
      publicUrl: true,
    }),
  }),
})
  .merge(SdkTableRowWithPermissionsV)
  .merge(SdkTableRowWithIdV)
  .merge(SdkTableRowWithDatesV);

export type SdkProjectEmbeddingT = z.infer<typeof SdkProjectEmbeddingV>;
