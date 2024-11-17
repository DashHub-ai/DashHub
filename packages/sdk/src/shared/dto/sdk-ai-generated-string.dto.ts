import { z } from 'zod';

import { SdkTimestampV } from './sdk-timestamp.dto';

export const SdkAIGeneratedStringV = z.object({
  value: z.string().nullable(),
  generated: z.boolean(),
  generatedAt: SdkTimestampV.nullable(),
});

export type SdkAIGeneratedStringT = z.infer<typeof SdkAIGeneratedStringV>;

export const SdkAIGeneratedStringInputV = z.union([
  z.object({
    value: z.null().optional(),
    generated: z.literal(true),
  }),
  z.object({
    value: z.string(),
    generated: z.literal(false),
  }),
]);

export type SdkAIGeneratedStringInputT = z.infer<typeof SdkAIGeneratedStringInputV>;
