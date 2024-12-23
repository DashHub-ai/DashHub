import type { ComponentProps } from 'react';

import type { SdKSearchAIModelsInputT, SdKSearchAIModelsOutputT } from '@llm/sdk';

import { createSdkAutocomplete } from '@llm/ui';
import { useWorkspaceOrganization } from '~/modules/workspace';

const AIModelsSearchAbstractSelect = createSdkAutocomplete<
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

export function AIModelsSearchSelect({ filters, ...props }: ComponentProps<typeof AIModelsSearchAbstractSelect>) {
  const { organization } = useWorkspaceOrganization();

  return (
    <AIModelsSearchAbstractSelect
      {...props}
      filters={{
        ...filters,
        organizationIds: [organization!.id],
      } as SdKSearchAIModelsInputT}
    />
  );
}
