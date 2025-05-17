import { controlled } from '@under-control/forms';
import { HeartIcon, HistoryIcon } from 'lucide-react';

import type { SdkIdsArrayT, SdkSearchAppsInputT, SdkSearchAppsOutputT } from '@dashhub/sdk';

import { useLastNonNullValue } from '@dashhub/commons-front';
import { useI18n } from '~/i18n';
import { AppsCategoriesSidebar, AppsCategoriesSidebarLoader } from '~/modules/apps-categories';
import { AppCategoryButton } from '~/modules/apps-categories/sidebar/items';

type Props = {
  result: SdkSearchAppsOutputT | null;
  onSilentReload: VoidFunction;
};

export const AppsSidebar = controlled<SdkSearchAppsInputT, Props>((
  {
    result,
    control: { value, setValue },
    onSilentReload,
  },
) => {
  const t = useI18n().pack.appsCategories.sidebar;

  const categoriesTree = useLastNonNullValue(result?.aggs?.categories);
  const totalFavorites = useLastNonNullValue(result?.aggs?.favorites.count) || 0;
  const totalRecent = useLastNonNullValue(result?.aggs?.recentlyUsed.count) || 0;

  const onSelectCategories = (categoriesIds: SdkIdsArrayT) => {
    setValue({
      merge: true,
      value: {
        categoriesIds,
        favorites: false,
        recent: false,
        offset: 0,
        sort: 'score:desc',
      },
    });
  };

  const onToggleFavorites = (isSelected: boolean) => {
    setValue({
      merge: true,
      value: {
        categoriesIds: [],
        favorites: isSelected,
        recent: false,
        offset: 0,
        sort: isSelected ? 'favorites:desc' : 'score:desc',
      },
    });
  };

  const onToggleRecent = (isSelected: boolean) => {
    setValue({
      merge: true,
      value: {
        categoriesIds: [],
        favorites: false,
        recent: isSelected,
        offset: 0,
        sort: isSelected ? 'recently-used:desc' : 'score:desc',
      },
    });
  };

  if (!categoriesTree) {
    return <AppsCategoriesSidebarLoader />;
  }

  return (
    <AppsCategoriesSidebar
      allowShowAllSelected={!value.favorites && !value.recent}
      tree={categoriesTree ?? []}
      selected={value.categoriesIds ?? []}
      onSelect={onSelectCategories}
      onReload={onSilentReload}
      prependItems={(
        <>
          {totalFavorites > 0 && (
            <li>
              <AppCategoryButton
                icon={<HeartIcon size={16} />}
                label={t.favoriteApps}
                count={totalFavorites}
                isSelected={!!value.favorites}
                onClick={() => onToggleFavorites(!value.favorites)}
              />
            </li>
          )}

          {totalRecent > 0 && (
            <li>
              <AppCategoryButton
                icon={<HistoryIcon size={16} />}
                label={t.recentApps}
                count={totalRecent}
                isSelected={!!value.recent}
                onClick={() => onToggleRecent(!value.recent)}
              />
            </li>
          )}
        </>
      )}
    />
  );
});
