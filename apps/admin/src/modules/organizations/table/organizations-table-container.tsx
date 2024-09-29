import { SdKSearchOrganizationsInputV, useSdkForLoggedIn } from '@llm/sdk';
import {
  PaginatedTable,
  PaginationSearchToolbarItem,
  PaginationToolbar,
  useDebouncedPaginatedSearch,
} from '~/components';
import { useI18n } from '~/i18n';

import { OrganizationsTableRow } from './organizations-table-row';

export function OrganizationsTableContainer() {
  const t = useI18n().pack.table.columns;
  const { sdks } = useSdkForLoggedIn();
  const { loading, pagination, result } = useDebouncedPaginatedSearch({
    schema: SdKSearchOrganizationsInputV,
    fallbackSearchParams: {},
    fetchResultsTask: sdks.dashboard.organizations.search,
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
      </PaginationToolbar>

      <PaginatedTable
        loading={loading}
        pagination={pagination.bind.entire()}
        result={result}
        columns={[
          { id: 'id', name: t.id },
          { id: 'name', name: t.name, className: 'uk-table-expand' },
          { id: 'createdAt', name: t.createdAt },
          { id: 'updatedAt', name: t.updatedAt },
          { id: 'actions', className: 'uk-table-shrink' },
        ]}
      >
        {({ item }) => (
          <OrganizationsTableRow key={item.id} item={item} />
        )}
      </PaginatedTable>
    </section>
  );
}
