import type { ControlHookResult } from '@under-control/forms';
import type { z } from 'zod';

import { clsx } from 'clsx';
import { flow } from 'fp-ts/lib/function';
import { type ReactNode, useMemo } from 'react';

import { useLastNonNullValue, useUpdateEffect } from '@llm/commons-front';
import {
  type SdkAppT,
  type SdkSearchAppsInputT,
  SdkSearchAppsInputV,
  useSdkForLoggedIn,
} from '@llm/sdk';
import { useWorkspaceOrganizationOrThrow } from '~/modules/workspace';
import {
  ArchiveFilterTabs,
  CardSkeletonGrid,
  FavoriteFiltersTabs,
  PaginatedList,
  PaginationSearchToolbarItem,
  PaginationToolbar,
  ResetFiltersButton,
  useDebouncedPaginatedSearch,
} from '~/ui';

import { AppsCategoriesSidebar, AppsCategoriesSidebarLoader } from '../../apps-categories/sidebar';
import { useFavoriteApps } from '../favorite';
import { AppCard, type AppCardProps } from './app-card';
import { AppsPlaceholder } from './apps-placeholder';

type Props = {
  storeDataInUrl?: boolean;
  itemPropsFn?: (item: SdkAppT) => Omit<AppCardProps, 'app'>;
  toolbar?: ReactNode;
  contentFooter?: ReactNode;
};

export type SearchAppsRouteUrlFiltersT = z.input<typeof SdkSearchAppsInputV>;

export function AppsContainer({ storeDataInUrl, toolbar, itemPropsFn, contentFooter }: Props) {
  const favorites = useFavoriteApps();
  const { assignWorkspaceToFilters } = useWorkspaceOrganizationOrThrow();

  const { sdks } = useSdkForLoggedIn();
  const { loading, pagination, result, silentReload, reset } = useDebouncedPaginatedSearch({
    storeDataInUrl,
    schema: SdkSearchAppsInputV,
    fallbackSearchParams: {
      limit: 12,

      ...favorites.hasFavorites && {
        ids: [...favorites.ids],
      },
    },
    fetchResultsTask: flow(assignWorkspaceToFilters, sdks.dashboard.apps.search),
  });

  const categoriesTree = useLastNonNullValue(result?.aggs?.categories);
  const { favoritesFilter, onToggleFavoriteFilter } = useAppsFavoritesFilter(pagination, favorites);
  const gridClassName = clsx(
    'gap-4 grid grid-cols-1',
    'lg:grid-cols-2 3xl:grid-cols-3',
  );

  return (
    <div className="flex">
      {!categoriesTree
        ? (
            <AppsCategoriesSidebarLoader />
          )
        : (
            <AppsCategoriesSidebar
              tree={categoriesTree ?? []}
              selected={pagination.value.categoriesIds ?? []}
              onSelect={(categoriesIds) => {
                pagination.setValue({
                  merge: true,
                  value: {
                    categoriesIds,
                    offset: 0,
                  },
                });
              }}
              onReload={silentReload}
            />
          )}
      <section className="flex-1 pl-6">
        <PaginationToolbar
          className="mb-6"
          suffix={(
            <>
              <FavoriteFiltersTabs
                totalFavorites={favorites.total}
                value={favoritesFilter}
                onChange={onToggleFavoriteFilter}
              />

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

function useAppsFavoritesFilter(
  pagination: ControlHookResult<SdkSearchAppsInputT>,
  favorites: ReturnType<typeof useFavoriteApps>,
) {
  const favoritesFilter = useMemo(
    () => {
      if (!favorites.hasFavorites) {
        return null;
      }

      if (favorites.ids.every(id => pagination.value.ids?.includes(id))) {
        return true;
      }

      if (favorites.ids.every(id => pagination.value.excludeIds?.includes(id))) {
        return false;
      }

      return null;
    },
    [favorites.ids, pagination.value],
  );

  const prevFavoritesFilter = useLastNonNullValue(favoritesFilter);

  const onToggleFavoriteFilter = (value: boolean | null) => {
    pagination.setValue({
      merge: true,
      value: {
        ids: undefined,
        excludeIds: undefined,
        ...value && {
          ids: favorites.ids,
        },
        ...value === false && {
          excludeIds: favorites.ids,
        },
      },
    });
  };

  useUpdateEffect(() => {
    if (prevFavoritesFilter && !favoritesFilter && pagination.value.ids?.length) {
      onToggleFavoriteFilter(null);
    }
  }, [favoritesFilter]);

  return {
    favoritesFilter,
    onToggleFavoriteFilter,
  };
}
