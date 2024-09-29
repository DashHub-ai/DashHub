import { SdKSearchOrganizationsInputV, useSdkForLoggedIn } from '@llm/sdk';
import { PaginatedTable, useDebouncedPaginatedSearch } from '~/components';

import { OrganizationsTableRow } from './organizations-table-row';

export function OrganizationsContainer() {
  const { sdks } = useSdkForLoggedIn();
  const { loading, pagination, result } = useDebouncedPaginatedSearch({
    schema: SdKSearchOrganizationsInputV,
    fallbackSearchParams: {},
    fetchResultsTask: sdks.dashboard.organizations.search,
  });

  return (
    <PaginatedTable
      loading={loading}
      pagination={pagination.bind.entire()}
      result={result}
      columns={[
        { id: 'name', name: 'Name' },
      ]}
    >
      {({ item }) => (
        <OrganizationsTableRow key={item.id} item={item} />
      )}
    </PaginatedTable>
  );
}
