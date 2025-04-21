import { z } from 'zod';

import { NonEmptyOrNullStringV } from '@llm/commons';
import {
  SdkIdNameUrlEntryV,
  SdkTableRowWithArchivedV,
  SdkTableRowWithDatesV,
  SdkTableRowWithIdNameV,
} from '~/shared';

import { SdkTableRowWithPermissionsV } from '../../permissions';
import { SdkBaseS3ResourceV } from '../../s3-files';
import { SdkAIExternalAPISchemaV } from './sdk-ai-external-api-schema.dto';

export const SdkAIExternalApiV = z.strictObject({
  organization: SdkIdNameUrlEntryV,
  logo: SdkBaseS3ResourceV.nullable(),
  description: NonEmptyOrNullStringV,
  schema: SdkAIExternalAPISchemaV,
})
  .merge(SdkTableRowWithPermissionsV)
  .merge(SdkTableRowWithIdNameV)
  .merge(SdkTableRowWithDatesV)
  .merge(SdkTableRowWithArchivedV);

export type SdkAIExternalApiT = z.infer<typeof SdkAIExternalApiV>;
