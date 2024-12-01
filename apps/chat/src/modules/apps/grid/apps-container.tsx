import {
  SdKSearchAppsInputV,
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

import { AppCard } from './app-card';
import { AppsPlaceholder } from './apps-placeholder';

type Props = {
  storeDataInUrl?: boolean;
};

export function AppsContainer({ storeDataInUrl = false }: Props) {
  const { organization } = useWorkspaceOrganizationOrThrow();

  const { sdks } = useSdkForLoggedIn();
  const { loading, pagination, result } = useDebouncedPaginatedSearch({
    storeDataInUrl,
    schema: SdKSearchAppsInputV,
    fallbackSearchParams: {
      limit: 12,
    },
    fetchResultsTask: filters => sdks.dashboard.apps.search({
      ...filters,
      organizationIds: [organization.id],
    }),
  });

  return (
    <section>
      <PaginationToolbar
        className="mb-6"
        suffix={(
          <ArchiveFilterTabs {...pagination.bind.path('archived')} />
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
                />
              ))}
            </div>
          );
        }}
      </PaginatedList>
    </section>
  );
}
