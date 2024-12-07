import { z } from 'zod';

import { NonEmptyOrNullStringV } from '@llm/commons';
import {
  SdkTableRowWithArchivedV,
  SdkTableRowWithDatesV,
  SdkTableRowWithIdNameV,
} from '~/shared';

export const SdkAppCategoryAggsV = z.object({
  totalApps: z.number(),
});

export type SdkAppCategoryAggsT = z.TypeOf<typeof SdkAppCategoryAggsV>;

export const SdkAppCategoryV = z.object({
  icon: z.string(),
  description: NonEmptyOrNullStringV,
  parentCategory: SdkTableRowWithIdNameV.nullable(),
  aggs: SdkAppCategoryAggsV,
  organization: SdkTableRowWithIdNameV,
})
  .merge(SdkTableRowWithIdNameV)
  .merge(SdkTableRowWithDatesV)
  .merge(SdkTableRowWithArchivedV);

export type SdkAppCategoryT = z.infer<typeof SdkAppCategoryV>;
