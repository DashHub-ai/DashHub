import type { ComponentProps } from 'react';

import type { SdkSearchProjectsInputT, SdkSearchProjectsOutputT } from '@llm/sdk';

import { createSdkAutocomplete } from '@llm/ui';
import { useWorkspaceOrganization } from '~/modules/workspace';

export const ProjectsAbstractSearchSelect = createSdkAutocomplete<
  SdkSearchProjectsOutputT,
  SdkSearchProjectsInputT
>({
  fetchFn: ({ sdk: { sdks }, phrase, limit, filters }) =>
    sdks.dashboard.projects.search({
      archived: false,
      sort: 'score:desc',
      offset: 0,
      limit,
      phrase,
      ...filters,
    }),
});

export function ProjectsSearchSelect({ filters, ...props }: ComponentProps<typeof ProjectsAbstractSearchSelect>) {
  const { assignWorkspaceToFilters } = useWorkspaceOrganization();

  return (
    <ProjectsAbstractSearchSelect
      {...props}
      filters={assignWorkspaceToFilters(filters as SdkSearchProjectsInputT)}
    />
  );
}
