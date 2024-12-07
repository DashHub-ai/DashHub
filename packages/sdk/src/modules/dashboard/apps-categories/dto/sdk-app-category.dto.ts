import { z } from 'zod';

import { NonEmptyOrNullStringV } from '@llm/commons';
import {
  SdkTableRowWithArchivedV,
  SdkTableRowWithDatesV,
  SdkTableRowWithIdNameV,
} from '~/shared';

export const SdkAppCategoryV = z.object({
  icon: z.string(),
  description: NonEmptyOrNullStringV,
  parentCategory: SdkTableRowWithIdNameV.nullable(),
})
  .merge(SdkTableRowWithIdNameV)
  .merge(SdkTableRowWithDatesV)
  .merge(SdkTableRowWithArchivedV);

export type SdkAppCategoryT = z.infer<typeof SdkAppCategoryV>;
