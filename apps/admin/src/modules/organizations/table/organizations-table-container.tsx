import { pipe } from 'fp-ts/lib/function';

import { tapTaskOption } from '@llm/commons';
import { useAsyncCallback } from '@llm/commons-front';
import { SdKSearchOrganizationsInputV, useSdkForLoggedIn } from '@llm/sdk';
import {
  ArchiveFilterTabs,
  CreateButton,
  PaginatedTable,
  PaginationSearchToolbarItem,
  PaginationToolbar,
  useDebouncedPaginatedSearch,
} from '~/components';
import { useI18n } from '~/i18n';

import { useOrganizationCreateModal } from '../form/create';
import { OrganizationsTableRow } from './organizations-table-row';

export function OrganizationsTableContainer() {
  const t = useI18n().pack.table.columns;
  const { sdks } = useSdkForLoggedIn();

  const { loading, pagination, result, reset, reload } = useDebouncedPaginatedSearch({
    schema: SdKSearchOrganizationsInputV,
    fallbackSearchParams: {},
    fetchResultsTask: sdks.dashboard.organizations.search,
  });

  const createModal = useOrganizationCreateModal();
  const [onCreate, createState] = useAsyncCallback(
    pipe(
      createModal.showAsOptional({
        defaultValue: {
          name: '',
          maxNumberOfUsers: 1,
        },
      }),
      tapTaskOption(reset),
    ),
  );

  return (
    <section>
      <PaginationToolbar
        suffix={(
          <CreateButton loading={createState.isLoading} onClick={onCreate} />
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

        <ArchiveFilterTabs {...pagination.bind.path('archived')} />
      </PaginationToolbar>

      <PaginatedTable
        loading={loading}
        pagination={pagination.bind.entire()}
        result={result}
        columns={[
          { id: 'id', name: t.id, className: 'uk-table-shrink' },
          { id: 'name', name: t.name, className: 'uk-table-expand' },
          { id: 'archived', name: t.archived, className: 'w-[150px]' },
          { id: 'createdAt', name: t.createdAt, className: 'w-[200px]' },
          { id: 'updatedAt', name: t.updatedAt, className: 'w-[200px]' },
          { id: 'actions', className: 'uk-table-shrink' },
        ]}
      >
        {({ item }) => (
          <OrganizationsTableRow
            key={item.id}
            item={item}
            onUpdated={reload}
          />
        )}
      </PaginatedTable>
    </section>
  );
}
