import type { ObjectWithStrictId } from '~/types';

import type { TreeNode } from './create-tree-from-list';

import { filterTreeByIds } from './filter-tree-by-ids';
import { mapTree } from './map-tree';

type CountedIdRecord = ObjectWithStrictId & {
  count: number;
};

export type CountedTreeNode<T extends ObjectWithStrictId> = TreeNode<T & {
  count: number;
}>;

export function withCountedTreeNodes<T extends ObjectWithStrictId>(
  aggs: CountedIdRecord[],
  tree: TreeNode<T>[],
): CountedTreeNode<T>[] {
  const filteredTree = filterTreeByIds(tree, aggs.map(({ id }) => id));

  return mapTree<T, CountedTreeNode<T>>(filteredTree, (node, mappedChildren) => {
    const nodeAgg = aggs.find(agg => agg.id === node.id);
    const count = (nodeAgg?.count || 0) + mappedChildren.reduce(
      (sum, child) => sum + child.count,
      0,
    );

    return {
      ...node,
      children: mappedChildren,
      count,
    };
  });
}
