import type { ComponentProps } from 'react';

import type { SdkSearchSearchEnginesInputT, SdkSearchSearchEnginesOutputT } from '@dashhub/sdk';

import { useWorkspaceOrganization } from '~/modules/workspace';
import { createSdkAutocomplete } from '~/ui';

const SearchEnginesSearchAbstractSelect = createSdkAutocomplete<
  SdkSearchSearchEnginesOutputT,
  SdkSearchSearchEnginesInputT
>({
  fetchFn: ({ sdk: { sdks }, phrase, limit, filters }) =>
    sdks.dashboard.searchEngines.search({
      archived: false,
      sort: 'score:desc',
      offset: 0,
      limit,
      phrase,
      ...filters,
    }),
});

export function SearchEnginesSearchSelect({ filters, ...props }: ComponentProps<typeof SearchEnginesSearchAbstractSelect>) {
  const { assignWorkspaceToFilters } = useWorkspaceOrganization();

  return (
    <SearchEnginesSearchAbstractSelect
      {...props}
      filters={assignWorkspaceToFilters(filters as SdkSearchSearchEnginesInputT)}
    />
  );
}
