import { z } from 'zod';

import { NonEmptyOrNullStringV } from '@dashhub/commons';
import {
  SdkIdNameUrlEntryV,
  SdkTableRowWithArchivedV,
  SdkTableRowWithDatesV,
  SdkTableRowWithIdNameV,
} from '~/shared';

export const SdkMCPServerV = z.object({
  organization: SdkIdNameUrlEntryV,
  description: NonEmptyOrNullStringV,
  url: z.string().url(),
  enabled: z.boolean(),
})
  .merge(SdkTableRowWithIdNameV)
  .merge(SdkTableRowWithDatesV)
  .merge(SdkTableRowWithArchivedV);

export type SdkMCPServerT = z.infer<typeof SdkMCPServerV>;

export const SdkCreateMCPServerInputV = z.object({
  organization: z.object({ id: z.number() }),
  name: z.string().min(1),
  description: NonEmptyOrNullStringV,
  url: z.string().url(),
  enabled: z.boolean().default(true),
});

export type SdkCreateMCPServerInputT = z.infer<typeof SdkCreateMCPServerInputV>;

export const SdkUpdateMCPServerInputV = SdkCreateMCPServerInputV.omit({ organization: true });

export type SdkUpdateMCPServerInputT = z.infer<typeof SdkUpdateMCPServerInputV>;
