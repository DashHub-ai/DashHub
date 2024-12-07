import type { z } from 'zod';

import { SdkTableRowWithIdV, ZodOmitArchivedFields, ZodOmitDateFields } from '~/shared';

import { SdkAppCategoryV } from './sdk-app-category.dto';

export const SdkCreateAppCategoryInputV = SdkAppCategoryV.omit({
  ...ZodOmitDateFields,
  ...ZodOmitArchivedFields,
  id: true,
  parentCategory: true,
})
  .extend({
    parentCategory: SdkTableRowWithIdV.nullable(),
  });

export type SdkCreateAppCategoryInputT = z.infer<typeof SdkCreateAppCategoryInputV>;

export const SdkCreateAppCategoryOutputV = SdkTableRowWithIdV;

export type SdkCreateAppCategoryOutputT = z.infer<typeof SdkCreateAppCategoryOutputV>;
