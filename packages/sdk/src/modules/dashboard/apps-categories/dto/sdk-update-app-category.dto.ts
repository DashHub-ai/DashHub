import type { z } from 'zod';

import { SdkTableRowWithIdV, ZodOmitArchivedFields, ZodOmitDateFields } from '~/shared';

import { SdkAppCategoryV } from './sdk-app-category.dto';

export const SdkUpdateAppCategoryInputV = SdkAppCategoryV
  .omit({
    ...ZodOmitDateFields,
    ...ZodOmitArchivedFields,
    id: true,
    organization: true,
    parentCategory: true,
  })
  .extend({
    parentCategory: SdkTableRowWithIdV.nullable(),
  });

export type SdkUpdateAppCategoryInputT = z.infer<typeof SdkUpdateAppCategoryInputV>;

export const SdkUpdateAppCategoryOutputV = SdkTableRowWithIdV;

export type SdkUpdateAppCategoryOutputT = z.infer<typeof SdkUpdateAppCategoryOutputV>;
