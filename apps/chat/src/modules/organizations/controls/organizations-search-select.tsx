import type { SdKSearchOrganizationsInputT, SdKSearchOrganizationsOutputT } from '@llm/sdk';

import { createSdkAutocomplete } from '@llm/ui';

export const OrganizationsSearchSelect = createSdkAutocomplete<
  SdKSearchOrganizationsOutputT,
  SdKSearchOrganizationsInputT
>({
  fetchFn: ({ sdk: { sdks }, phrase, limit, filters }) =>
    sdks.dashboard.organizations.search({
      archived: false,
      sort: 'score:desc',
      offset: 0,
      limit,
      phrase,
      ...filters,
    }),
});
