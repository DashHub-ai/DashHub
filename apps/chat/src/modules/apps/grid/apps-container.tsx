import { useMemo } from 'react';

import {
  type SdkAppT,
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

type Props = {
  itemPropsFn?: (item: SdkAppT) => Omit<AppCardProps, 'app'>;
};

export function AppsContainer({ itemPropsFn }: Props) {
  const favorites = useFavoriteApps();
  const { organization } = useWorkspaceOrganizationOrThrow();

  const { sdks } = useSdkForLoggedIn();
  const { loading, pagination, result } = useDebouncedPaginatedSearch({
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

  return (
    <section>
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
            <div className="gap-4 grid grid-cols-1 md:grid-cols-3">
              {items.map(item => (
                <AppCard
                  key={item.id}
                  app={item}
                  {...itemPropsFn?.(item)}
                />
              ))}
            </div>
          );
        }}
      </PaginatedList>
    </section>
  );
}
