import { z } from 'zod';

import { SdkTableRowWithDatesV, SdkTableRowWithIdNameV, SdkTableRowWithIdV } from '~/shared';

export const SdkProjectEmbeddingV = z.object({
  file: SdkTableRowWithIdNameV,
  text: z.string(),
})
  .merge(SdkTableRowWithIdV)
  .merge(SdkTableRowWithDatesV);

export type SdkProjectEmbeddingT = z.infer<typeof SdkProjectEmbeddingV>;
