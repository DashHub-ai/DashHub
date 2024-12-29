import { flow, pipe } from 'fp-ts/lib/function';

import { tapTaskOption } from '@llm/commons';
import { useAsyncCallback } from '@llm/commons-front';
import { SdkSearchUsersGroupsInputV, useSdkForLoggedIn } from '@llm/sdk';
import {
  ArchiveFilterTabs,
  CreateButton,
  PaginatedTable,
  PaginationSearchToolbarItem,
  PaginationToolbar,
  ResetFiltersButton,
  useDebouncedPaginatedSearch,
} from '@llm/ui';
import { useI18n } from '~/i18n';
import { useWorkspaceOrganizationOrThrow } from '~/modules/workspace';

import { useUsersGroupCreateModal } from '../form';
import { UsersGroupTableRow } from './users-groups-table-row';

export function UsersGroupsTableContainer() {
  const { pack } = useI18n();
  const t = pack.table.columns;

  const { sdks } = useSdkForLoggedIn();
  const { assignWorkspaceToFilters } = useWorkspaceOrganizationOrThrow();

  const { loading, pagination, result, reset, reload } = useDebouncedPaginatedSearch({
    schema: SdkSearchUsersGroupsInputV,
    fallbackSearchParams: {},
    storeDataInUrl: false,
    fetchResultsTask: flow(assignWorkspaceToFilters, sdks.dashboard.usersGroups.search),
  });

  const createModal = useUsersGroupCreateModal();
  const [onCreate, createState] = useAsyncCallback(
    pipe(
      createModal.showAsOptional({
        defaultValue: {
          name: '',
          users: [],
        },
      }),
      tapTaskOption(reset),
    ),
  );

  return (
    <section>
      <PaginationToolbar
        suffix={(
          <>
            <ArchiveFilterTabs {...pagination.bind.path('archived')} />
            <CreateButton
              className="uk-button-small"
              loading={createState.isLoading}
              onClick={onCreate}
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

        <ResetFiltersButton onClick={reset} />
      </PaginationToolbar>

      <PaginatedTable
        loading={loading}
        pagination={pagination.bind.entire()}
        result={result}
        columns={[
          { id: 'id', name: t.id, className: 'uk-table-shrink' },
          { id: 'name', name: t.email, className: 'uk-table-expand' },
          { id: 'users', name: pack.usersGroups.table.totalUsers, className: 'uk-table-expand' },
          { id: 'archived', name: t.archived, className: 'w-[150px]' },
          { id: 'updatedAt', name: t.updatedAt, className: 'w-[200px]' },
          { id: 'createdAt', name: t.updatedAt, className: 'w-[200px]' },
          { id: 'actions', className: 'uk-table-shrink' },
        ]}
      >
        {({ item }) => (
          <UsersGroupTableRow
            key={item.id}
            item={item}
            onUpdated={reload}
          />
        )}
      </PaginatedTable>
    </section>
  );
}
