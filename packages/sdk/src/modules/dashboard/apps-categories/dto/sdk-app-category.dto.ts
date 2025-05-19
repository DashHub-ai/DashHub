import { z } from 'zod';

import { NonEmptyOrNullStringV } from '@dashhub/commons';
import {
  SdkTableRowWithArchivedV,
  SdkTableRowWithDatesV,
  SdkTableRowWithIdNameV,
} from '~/shared';

export const SdkAppCategoryV = z.strictObject({
  icon: z.string(),
  description: NonEmptyOrNullStringV,
  parentCategory: SdkTableRowWithIdNameV.nullable(),
  organization: SdkTableRowWithIdNameV,
})
  .merge(SdkTableRowWithIdNameV)
  .merge(SdkTableRowWithDatesV)
  .merge(SdkTableRowWithArchivedV);

export type SdkAppCategoryT = z.infer<typeof SdkAppCategoryV>;
