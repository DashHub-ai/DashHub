import { SdKSearchUsersInputV, useSdkForLoggedIn } from '@llm/sdk';
import {
  ArchiveFilterTabs,
  PaginatedTable,
  PaginationSearchToolbarItem,
  PaginationToolbar,
  useDebouncedPaginatedSearch,
} from '~/components';
import { useI18n } from '~/i18n';

import { UsersTableRow } from './users-table-row';

export function UsersTableContainer() {
  const t = useI18n().pack.table.columns;
  const { sdks } = useSdkForLoggedIn();
  const { loading, pagination, result, reload } = useDebouncedPaginatedSearch({
    schema: SdKSearchUsersInputV,
    fallbackSearchParams: {},
    fetchResultsTask: sdks.dashboard.users.search,
  });

  return (
    <section>
      <PaginationToolbar>
        <PaginationSearchToolbarItem
          {...pagination.bind.path('phrase', {
            relatedInputs: ({ newGlobalValue, newControlValue }) => ({
              ...newGlobalValue,
              sort: newControlValue ? 'score:desc' : 'createdAt:asc',
            }),
          })}
        />

        <ArchiveFilterTabs {...pagination.bind.path('archived')} />
      </PaginationToolbar>

      <PaginatedTable
        loading={loading}
        pagination={pagination.bind.entire()}
        result={result}
        columns={[
          { id: 'id', name: t.id, className: 'uk-table-shrink' },
          { id: 'email', name: t.email, className: 'uk-table-expand' },
          { id: 'createdAt', name: t.createdAt, className: 'w-[200px]' },
          { id: 'updatedAt', name: t.updatedAt, className: 'w-[200px]' },
          { id: 'actions', className: 'uk-table-shrink' },
        ]}
      >
        {({ item }) => (
          <UsersTableRow
            key={item.id}
            item={item}
            onUpdated={reload}
          />
        )}
      </PaginatedTable>
    </section>
  );
}
