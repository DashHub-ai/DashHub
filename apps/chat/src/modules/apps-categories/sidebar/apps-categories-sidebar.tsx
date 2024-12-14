import { LayersIcon, SettingsIcon } from 'lucide-react';

import type { SdkCountedAppsCategoriesTreeT } from '@llm/sdk';

import { useI18n } from '~/i18n';

import { useManageAppsCategoriesModal } from '../modal/use-manage-apps-categories-modal';
import { AppsCategoriesSidebarLayout } from './apps-categories-sidebar-layout';
import { AppCategoryItem, type AppCategoryItemProps } from './items';
import { AppCategoryButton } from './items/app-category-button';

type Props =
  & Pick<AppCategoryItemProps, 'selected' | 'onSelect'>
  & {
    tree: SdkCountedAppsCategoriesTreeT;
    onReload?: VoidFunction;
  };

export function AppsCategoriesSidebar({ tree, selected, onSelect, onReload }: Props) {
  const t = useI18n().pack.appsCategories.sidebar;
  const totalCount = tree.reduce((sum, category) => sum + category.count, 0);
  const manageModal = useManageAppsCategoriesModal();

  const onShowSettings = async () => {
    await manageModal.show();
    onReload?.();
  };

  return (
    <AppsCategoriesSidebarLayout
      suffix={(
        <button
          type="button"
          className="hover:bg-hover p-1 rounded text-muted-foreground"
          disabled={manageModal.toggled}
          onClick={() => void onShowSettings()}
        >
          <SettingsIcon size={16} />
        </button>
      )}
    >
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