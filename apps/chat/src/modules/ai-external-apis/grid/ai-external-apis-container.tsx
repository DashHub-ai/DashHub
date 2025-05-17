import type { ReactNode } from 'react';
import type { z } from 'zod';

import { flow } from 'fp-ts/lib/function';

import {
  SdkSearchAIExternalAPIsInputV,
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

import { AIExternalAPICard } from './ai-external-api-card';
import { AIExternalAPIsPlaceholder } from './ai-external-apis-placeholder';

type Props = {
  storeDataInUrl?: boolean;
  toolbar?: ReactNode;
};

export type SearchAIExternalAPIsRouteUrlFiltersT = z.input<typeof SdkSearchAIExternalAPIsInputV>;

export function AIExternalAPIsContainer({ toolbar, storeDataInUrl = false }: Props) {
  const { assignWorkspaceToFilters } = useWorkspaceOrganizationOrThrow();

  const { sdks } = useSdkForLoggedIn();
  const { loading, pagination, result, silentReload, reset } = useDebouncedPaginatedSearch({
    storeDataInUrl,
    schema: SdkSearchAIExternalAPIsInputV,
    fallbackSearchParams: {
      limit: 12,
    },
    fetchResultsTask: flow(assignWorkspaceToFilters, sdks.dashboard.aiExternalAPIs.search),
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
            return <AIExternalAPIsPlaceholder />;
          }

          return (
            <div className={gridClassName}>
              {items.map(item => (
                <AIExternalAPICard
                  key={item.id}
                  api={item}
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
