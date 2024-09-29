import { SdKSearchUsersInputV, useSdkForLoggedIn } from '@llm/sdk';
import {
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
  const { loading, pagination, result } = useDebouncedPaginatedSearch({
    schema: SdKSearchUsersInputV,
    fallbackSearchParams: {},
    fetchResultsTask: sdks.dashboard.users.search,
  });

  return (
    <section>
      <PaginationToolbar>
        <PaginationSearchToolbarItem {...pagination.bind.path('phrase')} />
      </PaginationToolbar>

      <PaginatedTable
        loading={loading}
        pagination={pagination.bind.entire()}
        result={result}
        columns={[
          { id: 'id', name: t.id },
          { id: 'email', name: t.email, className: 'uk-table-expand' },
          { id: 'createdAt', name: t.createdAt },
          { id: 'updatedAt', name: t.updatedAt },
          { id: 'actions', className: 'uk-table-shrink' },
        ]}
      >
        {({ item }) => (
          <UsersTableRow key={item.id} item={item} />
        )}
      </PaginatedTable>
    </section>
  );
}
