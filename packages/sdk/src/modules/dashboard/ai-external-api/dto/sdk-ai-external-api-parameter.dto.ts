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
  'string',
  'number',
  'boolean',
]);

export type SdkAIExternalAPIParameterTypeT = z.infer<
  typeof SdkAIExternalAPIParameterTypeV
>;

export const SdkAIExternalAPIParameterValueV = z.object({
  type: SdkAIExternalAPIParameterTypeV,
  default: z.any().nullable(),
});

export type SdkAIExternalAPIParameterValueT = z.infer<
  typeof SdkAIExternalAPIParameterValueV
>;

export const SdkAIExternalAPIParameterV = z.object({
  required: z.boolean(),
  placement: SdkAIExternalAPIParameterPlacementV,
  value: SdkAIExternalAPIParameterValueV,
})
  .merge(SdkTableRowWithUuidV);

export type SdkAIExternalAPIParameterT = z.infer<typeof SdkAIExternalAPIParameterV>;
