import type { ObjectWithStrictId } from '~/types';

import type { TreeNode } from './create-tree-from-list';

export function filterTreeByIds<T extends ObjectWithStrictId>(
  tree: TreeNode<T>[],
  ids: (string | number)[],
): TreeNode<T>[] {
  return tree
    .filter((branch) => {
      const hasMatchingDescendant = (node: TreeNode<T>): boolean => {
        if (ids.includes(node.id)) {
          return true;
        }

        return node.children.some(hasMatchingDescendant);
      };

      return hasMatchingDescendant(branch);
    })
    .map(branch => ({
      ...branch,
      children: filterTreeByIds(branch.children, ids),
    }));
}
