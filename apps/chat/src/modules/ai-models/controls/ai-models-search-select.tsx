import type { SdKSearchAIModelsInputT, SdKSearchAIModelsOutputT } from '@llm/sdk';

import { createSdkAutocomplete } from '@llm/ui';

export const AIModelsSearchSelect = createSdkAutocomplete<
  SdKSearchAIModelsOutputT,
  SdKSearchAIModelsInputT
>({
  fetchFn: ({ sdk: { sdks }, phrase, limit, filters }) =>
    sdks.dashboard.aiModels.search({
      archived: false,
      sort: 'score:desc',
      offset: 0,
      limit,
      phrase,
      ...filters,
    }),
});
