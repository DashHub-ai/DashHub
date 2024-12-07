import { useState } from 'react';

import type { SdkCountedAppCategoryTreeNodeT, SdkTableRowIdT } from '@llm/sdk';

import { format } from '@llm/commons';
import { useI18n } from '~/i18n';
import { LazyIcon } from '~/modules/shared';

import { AppCategoryButton } from './app-category-button';

export type AppCategoryItemProps = {
  category: SdkCountedAppCategoryTreeNodeT;
  selected: SdkTableRowIdT[];
  onSelect: (id: SdkTableRowIdT[]) => void;
  depth?: number;
};

export function AppCategoryItem({ category, selected, onSelect, depth = 0 }: AppCategoryItemProps) {
  const t = useI18n().pack.apps.grid.sidebar;
  const [isExpanded, setIsExpanded] = useState(category.children.length <= 5);
  const [showAll, setShowAll] = useState(false);

  const { children } = category;

  const hasChildren = children.length > 0;
  const hasMoreChildren = children.length > 5;
  const isSelected = selected.includes(category.id);

  const visibleChildren = showAll
    ? children
    : children.slice(0, 5);

  return (
    <>
      <AppCategoryButton
        onClick={() => {
          const rejectedCategoryIds = selected.filter(id => id !== category.id);

          if (hasChildren) {
            onSelect([...rejectedCategoryIds]);
            setIsExpanded(!isExpanded);
          }
          else {
            onSelect([...rejectedCategoryIds, category.id]);
          }
        }}
        icon={<LazyIcon name={category.icon as any} size={16} />}
        label={category.name}
        count={category.count}
        isSelected={isSelected}
        hasChildren={hasChildren}
        isExpanded={isExpanded}
        depth={depth}
      />

      {hasChildren && isExpanded && (
        <div className="space-y-1 mt-1">
          {visibleChildren.map(child => (
            <AppCategoryItem
              key={child.id}
              category={child}
              selected={selected}
              onSelect={onSelect}
              depth={depth + 1}
            />
          ))}
          {hasMoreChildren && !showAll && (
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="px-3 py-1 w-full text-left text-muted-foreground text-xs hover:text-foreground"
            >
              {format(t.showMore, {
                count: children.length - 5,
              })}
            </button>
          )}
        </div>
      )}
    </>
  );
}
