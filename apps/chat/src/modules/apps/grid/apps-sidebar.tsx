import { controlled } from '@under-control/forms';

import type { SdkIdsArrayT, SdkSearchAppsInputT, SdkSearchAppsOutputT } from '@llm/sdk';

import { useLastNonNullValue } from '@llm/commons-front';
import { AppsCategoriesSidebar } from '~/modules/apps-categories';

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
  const categoriesTree = useLastNonNullValue(result?.aggs?.categories);

  const onSelectCategories = (categoriesIds: SdkIdsArrayT) => {
    setValue({
      merge: true,
      value: {
        categoriesIds,
        offset: 0,
      },
    });
  };

  return (
    <AppsCategoriesSidebar
      tree={categoriesTree ?? []}
      selected={value.categoriesIds ?? []}
      onSelect={onSelectCategories}
      onReload={onSilentReload}
    />
  );
});
