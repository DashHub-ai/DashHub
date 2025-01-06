import type { ComponentProps } from 'react';

import type { SdkSearchAppsCategoriesInputT, SdkSearchAppsCategoriesOutputT } from '@llm/sdk';

import { createSdkAutocomplete } from '@llm/ui';
import { useWorkspaceOrganization } from '~/modules/workspace';

const AppsCategoriesAbstractSearchSelect = createSdkAutocomplete<
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

export function AppsCategoriesSearchSelect({ filters, ...props }: ComponentProps<typeof AppsCategoriesAbstractSearchSelect>) {
  const { assignWorkspaceToFilters } = useWorkspaceOrganization();

  return (
    <AppsCategoriesAbstractSearchSelect
      {...props}
      filters={assignWorkspaceToFilters(filters as SdkSearchAppsCategoriesInputT)}
    />
  );
}
