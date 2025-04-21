import { z } from 'zod';

import { SdkTableRowWithUuidV } from '~/shared';

export const SdkAIExternalAPIParameterPlacementV = z.enum([
  'query',
  'header',
  'body',
]);

export type SdkAIExternalAPIParameterPlacementT = z.infer<
  typeof SdkAIExternalAPIParameterPlacementV
>;

export const SdkAIExternalAPIParameterTypeV = z.enum([
  'enum-string',
  'enum-number',
  'string',
  'number',
  'boolean',
]);

export type SdkAIExternalAPIParameterTypeT = z.infer<
  typeof SdkAIExternalAPIParameterTypeV
>;

export const SdkAIExternalAPIParameterAIInstructV = z.object({
  generated: z.boolean(),
  required: z.boolean(),
});

export type SdkAIExternalAPIParameterAIInstructT = z.infer<
  typeof SdkAIExternalAPIParameterAIInstructV
>;

export const SdkAIExternalAPIParameterV = z.object({
  name: z.string(),
  description: z.string(),
  type: SdkAIExternalAPIParameterTypeV,
  value: z.any().nullable(),
  placement: SdkAIExternalAPIParameterPlacementV,
  ai: SdkAIExternalAPIParameterAIInstructV.nullable(),
})
  .merge(SdkTableRowWithUuidV);

export type SdkAIExternalAPIParameterT = z.infer<typeof SdkAIExternalAPIParameterV>;
