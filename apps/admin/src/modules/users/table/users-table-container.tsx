import { pipe } from 'fp-ts/lib/function';

import { tapTaskOption } from '@llm/commons';
import { useAsyncCallback } from '@llm/commons-front';
import { SdKSearchUsersInputV, useSdkForLoggedIn } from '@llm/sdk';
import {
  ArchiveFilterTabs,
  CreateButton,
  PaginatedTable,
  PaginationSearchToolbarItem,
  PaginationToolbar,
  useDebouncedPaginatedSearch,
} from '~/components';
import { genRandomPassword } from '~/helpers';
import { useI18n } from '~/i18n';

import { useUserCreateModal } from '../form';
import { UsersTableRow } from './users-table-row';

export function UsersTableContainer() {
  const t = useI18n().pack.table.columns;
  const { sdks } = useSdkForLoggedIn();
  const { loading, pagination, result, reset, reload } = useDebouncedPaginatedSearch({
    schema: SdKSearchUsersInputV,
    fallbackSearchParams: {},
    fetchResultsTask: sdks.dashboard.users.search,
  });

  const createModal = useUserCreateModal();
  const [onCreate, createState] = useAsyncCallback(
    pipe(
      createModal.showAsOptional({
        defaultValue: {
          email: '',
          role: 'root',
          active: true,
          archiveProtection: false,
          auth: {
            email: {
              enabled: true,
            },
            password: {
              enabled: true,
              value: genRandomPassword(),
            },
          },
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
          { id: 'email', name: t.email, className: 'uk-table-expand' },
          { id: 'organization', name: t.organization, className: 'uk-table-expand' },
          { id: 'active', name: t.active, className: 'w-[150px]' },
          { id: 'auth', name: t.auth, className: 'w-[150px]' },
          { id: 'archived', name: t.archived, className: 'w-[150px]' },
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
