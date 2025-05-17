import type { ReactNode } from 'react';
import type { z } from 'zod';

import { flow } from 'fp-ts/lib/function';

import {
  SdkSearchProjectsInputV,
  useSdkForLoggedIn,
} from '@dashhub/sdk';
import { useWorkspaceOrganizationOrThrow } from '~/modules/workspace';
import {
  ArchiveFilterTabs,
  CardSkeletonGrid,
  PaginatedList,
  PaginationSearchToolbarItem,
  PaginationToolbar,
  ResetFiltersButton,
  useDebouncedPaginatedSearch,
} from '~/ui';

import { ProjectCard } from './project-card';
import { ProjectsPlaceholder } from './projects-placeholder';

type Props = {
  storeDataInUrl?: boolean;
  toolbar?: ReactNode;
};

export type SearchProjectsRouteUrlFiltersT = z.input<typeof SdkSearchProjectsInputV>;

export function ProjectsContainer({ toolbar, storeDataInUrl = false }: Props) {
  const { assignWorkspaceToFilters } = useWorkspaceOrganizationOrThrow();

  const { sdks } = useSdkForLoggedIn();
  const { loading, pagination, result, silentReload, reset } = useDebouncedPaginatedSearch({
    storeDataInUrl,
    schema: SdkSearchProjectsInputV,
    fallbackSearchParams: {
      limit: 12,
    },
    fetchResultsTask: flow(assignWorkspaceToFilters, sdks.dashboard.projects.search),
  });

  const gridClassName = 'gap-4 grid grid-cols-2 md:grid-cols-3';

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

        <ResetFiltersButton onClick={reset} />
      </PaginationToolbar>

      <PaginatedList
        result={result}
        loading={loading}
        pagination={pagination.bind.entire()}
        withEmptyPlaceholder={false}
        loadingFallback={(
          <CardSkeletonGrid className={gridClassName} count={12} />
        )}
      >
        {({ items, total }) => {
          if (!total) {
            return <ProjectsPlaceholder />;
          }

          return (
            <div className={gridClassName}>
              {items.map(item => (
                <ProjectCard
                  key={item.id}
                  project={item}
                  onAfterEdit={silentReload}
                  onAfterArchive={silentReload}
                  onAfterUnarchive={silentReload}
                />
              ))}
            </div>
          );
        }}
      </PaginatedList>
    </section>
  );
}
