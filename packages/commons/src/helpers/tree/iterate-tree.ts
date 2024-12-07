import type { ObjectWithStrictId } from '~/types';

import type { TreeNode } from './create-tree-from-list';

type TreeIterateCallbacks<T extends ObjectWithStrictId> = {
  enter?: (node: TreeNode<T>) => void;
  leave?: (node: TreeNode<T>) => void;
};

export function iterateTree<T extends ObjectWithStrictId>(
  tree: TreeNode<T>[],
  callbacks: TreeIterateCallbacks<T>,
): void {
  tree.forEach((node) => {
    callbacks.enter?.(node);
    iterateTree(node.children, callbacks);
    callbacks.leave?.(node);
  });
}
