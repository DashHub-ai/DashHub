import { controlled } from '@under-control/forms';
import { HeartIcon } from 'lucide-react';

import type { SdkIdsArrayT, SdkSearchAppsInputT, SdkSearchAppsOutputT } from '@llm/sdk';

import { useLastNonNullValue } from '@llm/commons-front';
import { useI18n } from '~/i18n';
import { AppsCategoriesSidebar } from '~/modules/apps-categories';
import { AppCategoryButton } from '~/modules/apps-categories/sidebar/items';

type Props = {
  result: SdkSearchAppsOutputT;
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

  const onSelectCategories = (categoriesIds: SdkIdsArrayT) => {
    setValue({
      merge: true,
      value: {
        categoriesIds,
        favorites: false,
        offset: 0,
      },
    });
  };

  const onToggleFavorites = (isSelected: boolean) => {
    setValue({
      merge: true,
      value: {
        categoriesIds: [],
        favorites: isSelected,
        offset: 0,
      },
    });
  };

  return (
    <AppsCategoriesSidebar
      allowShowAllSelected={!value.favorites}
      tree={categoriesTree ?? []}
      selected={value.categoriesIds ?? []}
      onSelect={onSelectCategories}
      onReload={onSilentReload}
      {...result.aggs.favorites.count > 0 && {
        prependItems: (
          <li>
            <AppCategoryButton
              icon={<HeartIcon size={16} />}
              label={t.favoriteApps}
              count={result.aggs.favorites.count}
              isSelected={!!value.favorites}
              onClick={() => onToggleFavorites(!value.favorites)}
            />
          </li>
        ),
      }}
    />
  );
});
