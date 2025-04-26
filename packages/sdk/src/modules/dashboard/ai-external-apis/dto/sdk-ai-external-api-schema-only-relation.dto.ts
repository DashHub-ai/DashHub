import type { z } from 'zod';

import { SdkTableRowWithIdV } from '~/shared';

import { SdkAIExternalAPISchemaV } from './sdk-ai-external-api-schema.dto';

export const SdkAIExternalAPISchemaOnlyRelationV = SdkTableRowWithIdV.extend({
  schema: SdkAIExternalAPISchemaV,
});

export type SdkAIExternalAPISchemaOnlyRelationT = z.infer<typeof SdkAIExternalAPISchemaOnlyRelationV>;
