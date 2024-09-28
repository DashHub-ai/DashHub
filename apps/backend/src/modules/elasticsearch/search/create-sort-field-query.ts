import * as esb from 'elastic-builder';
import { snakeCase } from 'snake-case';

import type { Nullable } from '@llm/commons';

import { destructSdkSortItem, type SdkSortItemT } from '@llm/sdk';

export type SortQueryAttrs = {
  textFieldsMapping?: Record<string, string>;
};

export function createSortFieldQuery(
  sort: Nullable<SdkSortItemT<string>>,
  {
    textFieldsMapping = {
      name: 'name.raw',
    },
  }: SortQueryAttrs = {},
) {
  const { name, direction } = destructSdkSortItem(sort ?? 'createdAt:desc');
  const formattedName = name
    .split('.')
    .map(pathSegment => snakeCase(pathSegment))
    .join('.');

  return esb.sort(textFieldsMapping[formattedName] ?? formattedName, direction);
}
