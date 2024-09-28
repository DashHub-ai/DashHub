import * as esb from 'elastic-builder';

import type { Nullable } from '@llm/commons';
import type { SdkSortItemT } from '@llm/sdk';

import { createSortFieldQuery, type SortQueryAttrs } from './create-sort-field-query';

export function createScoredSortFieldQuery(
  sort: Nullable<SdkSortItemT<string>>,
  attrs: SortQueryAttrs = {},
) {
  switch (sort) {
    case 'score:desc':
      return [
        esb.sort('_score', 'desc'),
        createSortFieldQuery('createdAt:desc'),
      ];

    default:
      return [
        createSortFieldQuery(sort, attrs),
      ];
  }
}
