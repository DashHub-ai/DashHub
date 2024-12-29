import type { ReactNode } from 'react';

import { flow } from 'fp-ts/lib/function';

import {
  SdKSearchProjectsInputV,
  useSdkForLoggedIn,
} from '@llm/sdk';
import {
  ArchiveFilterTabs,
  PaginatedList,
  PaginationSearchToolbarItem,
  PaginationToolbar,
  useDebouncedPaginatedSearch,
} from '@llm/ui';
import { useWorkspaceOrganizationOrThrow } from '~/modules/workspace';

import { ProjectCard } from './project-card';
import { ProjectsPlaceholder } from './projects-placeholder';

type Props = {
  storeDataInUrl?: boolean;
  toolbar?: ReactNode;
};

export function ProjectsContainer({ toolbar, storeDataInUrl = false }: Props) {
  const { assignWorkspaceToFilters } = useWorkspaceOrganizationOrThrow();

  const { sdks } = useSdkForLoggedIn();
  const { loading, pagination, result, silentReload } = useDebouncedPaginatedSearch({
    storeDataInUrl,
    schema: SdKSearchProjectsInputV,
    fallbackSearchParams: {
      limit: 12,
    },
    fetchResultsTask: flow(assignWorkspaceToFilters, sdks.dashboard.projects.search),
  });

  return (
    <section>
      <PaginationToolbar
        className="mb-6"
        suffix={(
          <>
            <ArchiveFilterTabs {...pagination.bind.path('archived')} />
            {toolbar}
          </>
        )}
      >
        <PaginationSearchToolbarItem
          {...pagination.bind.path('phrase', {
            relatedInputs: ({ newGlobalValue, newControlValue }) => ({
              ...newGlobalValue,
              sort: newControlValue ? 'score:desc' : 'createdAt:asc',
            }),
          })}
        />
      </PaginationToolbar>

      <PaginatedList
        result={result}
        loading={loading}
        pagination={pagination.bind.entire()}
        withEmptyPlaceholder={false}
      >
        {({ items, total }) => {
          if (!total) {
            return <ProjectsPlaceholder />;
          }

          return (
            <div className="gap-4 grid grid-cols-2 md:grid-cols-4">
              {items.map(item => (
                <ProjectCard
                  key={item.id}
                  project={item}
                  onAfterEdit={silentReload}
                  onAfterArchive={silentReload}
                />
              ))}
            </div>
          );
        }}
      </PaginatedList>
    </section>
  );
}
