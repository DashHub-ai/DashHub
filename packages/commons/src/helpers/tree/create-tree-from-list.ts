import type { ObjectWithStrictId } from '~/types';

import { isNil } from '../is-nil';

export type TreeNode<T extends ObjectWithStrictId> =
  & T
  & {
    children: TreeNode<T>[];
  };

export function createTreeFromList<T extends ObjectWithStrictId>(
  getParentId: (item: T) => string | number | undefined,
  items: T[],
): TreeNode<T>[] {
  const itemMap = new Map<string | number, TreeNode<T>>();

  for (const item of items) {
    itemMap.set(item.id, {
      ...item,
      children: [],
    } as TreeNode<T>);
  }

  for (const item of items) {
    const parentId = getParentId(item);

    if (!parentId) {
      continue;
    }

    const parent = itemMap.get(parentId);

    if (parent) {
      parent.children.push(itemMap.get(item.id)!);
    }
  }

  return [...itemMap.values()].filter(item => isNil(getParentId(item)));
}
