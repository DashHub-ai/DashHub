import type { ControlHookResult } from '@under-control/forms';

import { clsx } from 'clsx';
import { type ReactNode, useMemo } from 'react';

import { useLastNonNullValue, useUpdateEffect } from '@llm/commons-front';
import {
  type SdkAppT,
  type SdKSearchAppsInputT,
  SdKSearchAppsInputV,
  useSdkForLoggedIn,
} from '@llm/sdk';
import {
  ArchiveFilterTabs,
  FavoriteFiltersTabs,
  PaginatedList,
  PaginationSearchToolbarItem,
  PaginationToolbar,
  useDebouncedPaginatedSearch,
} from '@llm/ui';
import { useWorkspaceOrganizationOrThrow } from '~/modules/workspace';

import { useFavoriteApps } from '../favorite';
import { AppCard, type AppCardProps } from './app-card';
import { AppsPlaceholder } from './apps-placeholder';
import { AppsCategoriesSidebar, AppsCategoriesSidebarLoader } from './sidebar';

type Props = {
  itemPropsFn?: (item: SdkAppT) => Omit<AppCardProps, 'app'>;
  toolbar?: ReactNode;
  columns?: number;
};

export function AppsContainer({ toolbar, itemPropsFn, columns = 3 }: Props) {
  const favorites = useFavoriteApps();
  const { organization } = useWorkspaceOrganizationOrThrow();

  const { sdks } = useSdkForLoggedIn();
  const { loading, pagination, result, silentReload } = useDebouncedPaginatedSearch({
    storeDataInUrl: false,
    schema: SdKSearchAppsInputV,
    fallbackSearchParams: {
      limit: 12,

      ...favorites.hasFavorites && {
        ids: [...favorites.ids],
      },
    },
    fetchResultsTask: filters => sdks.dashboard.apps.search({
      ...filters,
      organizationIds: [organization.id],
    }),
  });

  const categoriesTree = useLastNonNullValue(result?.aggs?.categories);
  const { favoritesFilter, onToggleFavoriteFilter } = useAppsFavoritesFilter(pagination, favorites);

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
        </PaginationToolbar>

        <PaginatedList
          result={result}
          loading={loading}
          pagination={pagination.bind.entire()}
          withEmptyPlaceholder={false}
        >
          {({ items, total }) => {
            if (!total) {
              return <AppsPlaceholder />;
            }

            return (
              <div
                className={clsx(
                  'gap-4 grid grid-cols-1',
                  getGridColumns(columns),
                )}
              >
                {items.map(item => (
                  <AppCard
                    key={item.id}
                    app={item}
                    onAfterEdit={() => {
                      void silentReload();
                    }}
                    {...itemPropsFn?.(item)}
                  />
                ))}
              </div>
            );
          }}
        </PaginatedList>
      </section>
    </div>
  );
}

function useAppsFavoritesFilter(
  pagination: ControlHookResult<SdKSearchAppsInputT>,
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

function getGridColumns(columns: number) {
  switch (columns) {
    case 2:
      return 'md:grid-cols-2';
    case 4:
      return 'md:grid-cols-4';
    case 5:
      return 'md:grid-cols-5';
    case 6:
      return 'md:grid-cols-6';
    default:
      return 'md:grid-cols-3';
  }
}
