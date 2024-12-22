import type { ComponentProps } from 'react';

import type { SdKSearchProjectsInputT, SdKSearchProjectsOutputT } from '@llm/sdk';

import { createSdkAutocomplete } from '@llm/ui';
import { useWorkspaceOrganization } from '~/modules/workspace';

export const ProjectsAbstractSearchSelect = createSdkAutocomplete<
  SdKSearchProjectsOutputT,
  SdKSearchProjectsInputT
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
  const { organization } = useWorkspaceOrganization();

  return (
    <ProjectsAbstractSearchSelect
      {...props}
      filters={{
        ...filters,
        organizationIds: [organization!.id],
      } as SdKSearchProjectsInputT}
    />
  );
}
