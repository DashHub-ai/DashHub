import type { SdkSearchAppsCategoriesInputT, SdkSearchAppsCategoriesOutputT } from '@llm/sdk';

import { createSdkAutocomplete } from '@llm/ui';

export const AppsCategoriesSearchSelect = createSdkAutocomplete<
  SdkSearchAppsCategoriesOutputT,
  SdkSearchAppsCategoriesInputT
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
