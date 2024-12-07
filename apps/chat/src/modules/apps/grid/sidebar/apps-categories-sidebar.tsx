import { LayersIcon } from 'lucide-react';

import type { SdkCountedAppsCategoriesTreeT } from '@llm/sdk';

import { useI18n } from '~/i18n';

import { AppCategoryButton } from './app-category-button';
import { AppCategoryItem, type AppCategoryItemProps } from './app-category-item';
import { AppsCategoriesSidebarLayout } from './apps-categories-sidebar-layout';

type Props =
  & Pick<AppCategoryItemProps, 'selected' | 'onSelect'>
  & {
    tree: SdkCountedAppsCategoriesTreeT;
  };

export function AppsCategoriesSidebar({ tree, selected, onSelect }: Props) {
  const t = useI18n().pack.apps.grid.sidebar;
  const totalCount = tree.reduce((sum, category) => sum + category.count, 0);

  return (
    <AppsCategoriesSidebarLayout>
      <ul className="space-y-1">
        <li>
          <AppCategoryButton
            onClick={() => onSelect([])}
            icon={<LayersIcon size={16} />}
            label={t.allApps}
            count={totalCount}
            isSelected={selected.length === 0}
          />
        </li>

        <li>
          <div className="my-4 border-b border-border" />
        </li>

        {tree.map(category => (
          <li key={category.id}>
            <AppCategoryItem
              category={category}
              selected={selected}
              onSelect={onSelect}
            />
          </li>
        ))}
      </ul>
    </AppsCategoriesSidebarLayout>
  );
}
