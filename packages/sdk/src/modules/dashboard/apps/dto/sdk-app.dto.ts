import { z } from 'zod';

import { NonEmptyOrNullStringV } from '@llm/commons';
import {
  SdkIdNameUrlEntryV,
  SdkTableRowWithArchivedV,
  SdkTableRowWithDatesV,
  SdkTableRowWithIdNameV,
  SdkTableRowWithIdV,
  SdkTableRowWithUuidV,
} from '~/shared';

import { SdkAIExternalAPISchemaOnlyRelationV } from '../../ai-external-apis';
import { SdkTableRowWithPermissionsV } from '../../permissions/dto/sdk-table-row-with-permissions.dto';
import { SdkBaseS3ResourceV } from '../../s3-files';

export const SdkAppV = z.strictObject({
  organization: SdkIdNameUrlEntryV,
  chatContext: z.string(),
  description: NonEmptyOrNullStringV,
  category: SdkTableRowWithIdNameV,
  project: SdkTableRowWithIdV,
  aiModel: SdkTableRowWithIdNameV.nullable(),
  aiExternalAPI: SdkAIExternalAPISchemaOnlyRelationV.nullable(),
  logo: SdkBaseS3ResourceV.nullable(),
  promotion: z.number(),
  recentChats: z.array(SdkTableRowWithUuidV),
})
  .merge(SdkTableRowWithPermissionsV)
  .merge(SdkTableRowWithIdNameV)
  .merge(SdkTableRowWithDatesV)
  .merge(SdkTableRowWithArchivedV);

export type SdkAppT = z.infer<typeof SdkAppV>;
