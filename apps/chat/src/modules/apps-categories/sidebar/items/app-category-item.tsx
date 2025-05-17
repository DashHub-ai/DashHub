import { EllipsisIcon } from 'lucide-react';
import { useState } from 'react';

import type { SdkCountedAppCategoryTreeNodeT, SdkTableRowIdT } from '@dashhub/sdk';

import { format } from '@dashhub/commons';
import { useI18n } from '~/i18n';
import { LazyIcon } from '~/modules/shared';

import { AppCategoryButton } from './app-category-button';

export type AppCategoryItemProps = {
  category: SdkCountedAppCategoryTreeNodeT;
  selected: SdkTableRowIdT[];
  onSelect: (id: SdkTableRowIdT[]) => void;
  depth?: number;
  itemsLimit?: number;
};

const DEFAULT_ITEMS_LIMIT = 5;

export function AppCategoryItem(
  {
    category,
    selected,
    onSelect,
    depth = 0,
    itemsLimit = DEFAULT_ITEMS_LIMIT,
  }: AppCategoryItemProps,
) {
  const t = useI18n().pack.appsCategories.sidebar;
  const [isExpanded, setIsExpanded] = useState(category.children.length <= itemsLimit);
  const [showAll, setShowAll] = useState(false);

  const { children } = category;
  const childrenTotalCount = children.reduce((sum, child) => sum + child.count, 0);
  const otherItemsCount = category.count - childrenTotalCount;

  const hasChildren = children.length > 0;
  const hasMoreChildren = children.length > itemsLimit;
  const isSelected = selected.includes(category.id);

  const visibleChildren = showAll
    ? children
    : children.slice(0, itemsLimit);

  return (
    <>
      <AppCategoryButton
        className="flex-1"
        icon={<LazyIcon name={category.icon as any} size={16} />}
        label={category.name}
        count={category.count}
        isSelected={!hasChildren && isSelected}
        hasChildren={hasChildren}
        isExpanded={isExpanded}
        depth={depth}
        onClick={() => {
          if (hasChildren) {
            setIsExpanded(!isExpanded);
          }
          else {
            onSelect([category.id]);
          }
        }}
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

          {otherItemsCount > 0 && (
            <AppCategoryButton
              isSelected={isSelected}
              onClick={() => onSelect([category.id])}
              icon={<EllipsisIcon size={16} />}
              label={t.otherCategoryItems}
              count={otherItemsCount}
              depth={depth + 1}
            />
          )}

          {hasMoreChildren && !showAll && (
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="px-3 py-1 w-full text-muted-foreground hover:text-foreground text-xs text-left"
            >
              {format(t.showMore, {
                count: children.length - itemsLimit,
              })}
            </button>
          )}
        </div>
      )}
    </>
  );
}
