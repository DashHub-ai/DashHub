import { flow, pipe } from 'fp-ts/lib/function';

import { genRandomPassword, tapTaskOption } from '@llm/commons';
import { useAsyncCallback } from '@llm/commons-front';
import {
  type SdkSearchUserItemT,
  type SdkSearchUsersInputT,
  SdkSearchUsersInputV,
  useSdkForLoggedIn,
} from '@llm/sdk';
import { useI18n } from '~/i18n';
import { useWorkspaceOrganization } from '~/modules/workspace';
import {
  ArchiveFilterTabs,
  CreateButton,
  PaginatedTable,
  PaginationSearchToolbarItem,
  PaginationToolbar,
  ResetFiltersButton,
  useDebouncedPaginatedSearch,
} from '~/ui';

import type { CreateUserFormValue } from '../form/create/types';

import { useUserCreateModal } from '../form';
import { UsersTableRow, type UsersTableRowProps } from './users-table-row';

type Props = {
  itemPropsFn?: (item: SdkSearchUserItemT) => Omit<UsersTableRowProps, 'item' | 'onUpdated'>;
  filters?: Partial<SdkSearchUsersInputT>;
};

export function UsersTableContainer({ filters: forwardedFilters, itemPropsFn }: Props) {
  const { pack } = useI18n();
  const t = pack.table.columns;

  const { sdks } = useSdkForLoggedIn();
  const { organization, assignWorkspaceToFilters } = useWorkspaceOrganization();

  const { loading, pagination, result, reset, reload } = useDebouncedPaginatedSearch({
    schema: SdkSearchUsersInputV,
    fallbackSearchParams: {},
    storeDataInUrl: false,
    fetchResultsTask: flow(
      assignWorkspaceToFilters,
      filters => sdks.dashboard.users.search({
        ...filters,
        ...forwardedFilters,
      }),
    ),
  });

  const defaultValue: CreateUserFormValue = (() => {
    if (!organization) {
      return {
        email: '',
        name: '',
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
      };
    }

    return {
      email: '',
      name: '',
      role: 'user',
      active: true,
      archiveProtection: false,
      organization: {
        item: organization,
        role: 'member',
      },
      auth: {
        email: {
          enabled: true,
        },
        password: {
          enabled: true,
          value: genRandomPassword(),
        },
      },
    };
  })();

  const createModal = useUserCreateModal();
  const [onCreate, createState] = useAsyncCallback(
    pipe(
      createModal.showAsOptional({
        defaultValue,
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
        className="bg-white"
        loading={loading}
        pagination={pagination.bind.entire()}
        result={result}
        columns={[
          { id: 'id', name: t.id, className: 'uk-table-shrink' },
          { id: 'email', name: t.email, className: 'uk-table-expand' },
          { id: 'name', name: t.name, className: 'uk-table-expand' },
          { id: 'role', name: t.role, className: 'w-[150px]' },
          { id: 'active', name: t.active, className: 'w-[150px]' },
          { id: 'auth', name: t.auth, className: 'w-[150px]' },
          { id: 'archived', name: t.archived, className: 'w-[150px]' },
          { id: 'updatedAt', name: t.updatedAt, className: 'w-[200px]' },
          { id: 'actions', className: 'uk-table-shrink' },
        ]}
      >
        {({ item }) => (
          <UsersTableRow
            key={item.id}
            item={item}
            onUpdated={reload}
            {...itemPropsFn?.(item)}
          />
        )}
      </PaginatedTable>
    </section>
  );
}
