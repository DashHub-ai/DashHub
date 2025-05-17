import type { SdkSearchOrganizationsInputT, SdkSearchOrganizationsOutputT } from '@dashhub/sdk';

import { createSdkAutocomplete } from '~/ui';

export const OrganizationsSearchSelect = createSdkAutocomplete<
  SdkSearchOrganizationsOutputT,
  SdkSearchOrganizationsInputT
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
