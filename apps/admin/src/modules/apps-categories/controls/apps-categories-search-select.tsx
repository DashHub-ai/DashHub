import type { SdKSearchAppsCategoriesInputT, SdkSearchAppsCategoriesOutputT } from '@llm/sdk';

import { createSdkAutocomplete } from '@llm/ui';

export const AppsCategoriesSearchSelect = createSdkAutocomplete<
  SdkSearchAppsCategoriesOutputT,
  SdKSearchAppsCategoriesInputT
>({
  fetchFn: ({ sdk: { sdks }, phrase, limit, filters }) =>
    sdks.dashboard.appsCategories.search({
      archived: false,
      sort: 'score:desc',
      offset: 0,
      limit,
      phrase,
      ...filters,
    }),
});
