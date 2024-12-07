import type { z } from 'zod';

import { SdkTableRowWithIdV, ZodOmitArchivedFields, ZodOmitDateFields } from '~/shared';

import { SdkAppCategoryV } from './sdk-app-category.dto';

export const SdkUpdateAppCategoryInputV = SdkAppCategoryV.omit({
  ...ZodOmitDateFields,
  ...ZodOmitArchivedFields,
  id: true,
  organization: true,
  aggs: true,
});

export type SdkUpdateAppCategoryInputT = z.infer<typeof SdkUpdateAppCategoryInputV>;

export const SdkUpdateAppCategoryOutputV = SdkTableRowWithIdV;

export type SdkUpdateAppCategoryOutputT = z.infer<typeof SdkUpdateAppCategoryOutputV>;
