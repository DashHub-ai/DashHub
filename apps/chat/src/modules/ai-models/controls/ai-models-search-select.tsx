import type { ComponentProps } from 'react';

import type { SdkSearchAIModelsInputT, SdkSearchAIModelsOutputT } from '@llm/sdk';

import { createSdkAutocomplete } from '@llm/ui';
import { useWorkspaceOrganization } from '~/modules/workspace';

const AIModelsSearchAbstractSelect = createSdkAutocomplete<
  SdkSearchAIModelsOutputT,
  SdkSearchAIModelsInputT
>({
  fetchFn: ({ sdk: { sdks }, phrase, limit, filters }) =>
    sdks.dashboard.aiModels.search({
      archived: false,
      embedding: false,
      sort: 'score:desc',
      offset: 0,
      limit,
      phrase,
      ...filters,
    }),
});

export function AIModelsSearchSelect({ filters, ...props }: ComponentProps<typeof AIModelsSearchAbstractSelect>) {
  const { assignWorkspaceToFilters } = useWorkspaceOrganization();

  return (
    <AIModelsSearchAbstractSelect
      {...props}
      filters={assignWorkspaceToFilters(filters as SdkSearchAIModelsInputT)}
    />
  );
}
