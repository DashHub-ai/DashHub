import type { ReactNode } from 'react';
import type { z } from 'zod';

import { clsx } from 'clsx';
import { flow } from 'fp-ts/lib/function';

import {
  type SdkAppT,
  SdkSearchAppsInputV,
  useSdkForLoggedIn,
} from '@llm/sdk';
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

import { AppCard, type AppCardProps } from './app-card';
import { AppsPlaceholder } from './apps-placeholder';
import { AppsSidebar } from './apps-sidebar';

type Props = {
  storeDataInUrl?: boolean;
  itemPropsFn?: (item: SdkAppT) => Omit<AppCardProps, 'app'>;
  toolbar?: ReactNode;
  contentFooter?: ReactNode;
};

export type SearchAppsRouteUrlFiltersT = z.input<typeof SdkSearchAppsInputV>;

export function AppsContainer({ storeDataInUrl, toolbar, itemPropsFn, contentFooter }: Props) {
  const { assignWorkspaceToFilters } = useWorkspaceOrganizationOrThrow();

  const { sdks } = useSdkForLoggedIn();
  const { loading, pagination, result, silentReload, reset } = useDebouncedPaginatedSearch({
    storeDataInUrl,
    schema: SdkSearchAppsInputV,
    fallbackSearchParams: {
      limit: 12,
      favoritesAgg: true,
      recentAgg: true,
      includeRecentChats: true,
    },
    fetchResultsTask: flow(assignWorkspaceToFilters, sdks.dashboard.apps.search),
  });

  const gridClassName = clsx(
    'gap-4 grid grid-cols-1',
    'lg:grid-cols-2 3xl:grid-cols-3',
  );

  return (
    <div className="flex">
      <AppsSidebar
        {...pagination.bind.entire()}
        result={result}
        onSilentReload={silentReload}
      />

      <section className="flex-1 pl-6">
        <PaginationToolbar
          className="mb-6"
          suffix={(
            <>
              <ArchiveFilterTabs
                {...pagination.bind.path('archived')}
                withAll={false}
              />

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
              return <AppsPlaceholder />;
            }

            return (
              <div className={gridClassName}>
                {items.map(item => (
                  <AppCard
                    key={item.id}
                    app={item}
                    onAfterArchive={silentReload}
                    onAfterUnarchive={silentReload}
                    onAfterToggleFavorite={silentReload}
                    {...itemPropsFn?.(item)}
                  />
                ))}
              </div>
            );
          }}
        </PaginatedList>

        {contentFooter}
      </section>
    </div>
  );
}
