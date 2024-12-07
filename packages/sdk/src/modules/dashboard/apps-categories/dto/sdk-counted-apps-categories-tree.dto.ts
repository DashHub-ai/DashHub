import { z } from 'zod';

import type { CountedTreeNode } from '@llm/commons';

import { type SdkAppCategoryT, SdkAppCategoryV } from './sdk-app-category.dto';

export type SdkCountedAppCategoryTreeNodeT = CountedTreeNode<SdkAppCategoryT>;

export type SdkCountedAppsCategoriesTreeT = SdkCountedAppCategoryTreeNodeT[];

const SdkCountedAppsCategoryNodeV: z.ZodType<SdkCountedAppCategoryTreeNodeT> = z.lazy(() =>
  SdkAppCategoryV.extend({
    children: z.array(SdkCountedAppsCategoryNodeV),
    count: z.number(),
  }),
);

export const SdkCountedAppsCategoriesTreeV = z.array(SdkCountedAppsCategoryNodeV);
