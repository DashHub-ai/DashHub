import { z } from 'zod';

import { SdkTableRowWithDatesV, SdkTableRowWithIdNameV, SdkTableRowWithIdV } from '~/shared';

import { SdkBaseS3ResourceV } from '../../s3-files';

export const SdkProjectEmbeddingV = z.object({
  text: z.string(),
  projectFile: SdkTableRowWithIdNameV.extend({
    resource: SdkBaseS3ResourceV.pick({
      id: true,
      publicUrl: true,
    }),
  }),
})
  .merge(SdkTableRowWithIdV)
  .merge(SdkTableRowWithDatesV);

export type SdkProjectEmbeddingT = z.infer<typeof SdkProjectEmbeddingV>;
