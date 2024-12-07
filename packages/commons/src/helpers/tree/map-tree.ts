import type { ObjectWithStrictId } from '~/types';

import type { TreeNode } from './create-tree-from-list';

export function mapTree<T extends ObjectWithStrictId, R>(
  tree: TreeNode<T>[],
  mapper: (node: TreeNode<T>, mappedChildren: R[]) => R | null,
): R[] {
  return tree.flatMap((node) => {
    const mappedChildren = mapTree(node.children, mapper);
    const result = mapper(node, mappedChildren);

    return result ? [result] : [];
  });
}
