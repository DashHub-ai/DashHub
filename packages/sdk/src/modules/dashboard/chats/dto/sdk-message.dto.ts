import { z } from 'zod';

import { SdkTableRowWithDatesV, SdkTableRowWithIdNameV } from '~/shared';

export const SdkMessageRoleV = z.enum(['user', 'assistant', 'system']);

export type SdkMessageRoleT = z.infer<typeof SdkMessageRoleV>;

export const SdkRepeatedMessageV = z.object({
  content: z.string(),
  repeatCount: z.number(),
})
  .merge(SdkTableRowWithIdNameV)
  .merge(SdkTableRowWithDatesV);

export type SdkRepeatedMessageT = z.infer<typeof SdkRepeatedMessageV>;

export const SdkMessageV = z.object({
  content: z.string(),
  role: SdkMessageRoleV,
  repeats: z.array(SdkRepeatedMessageV),
})
  .merge(SdkTableRowWithIdNameV)
  .merge(SdkTableRowWithDatesV);

export type SdkMessageT = z.infer<typeof SdkMessageV>;
