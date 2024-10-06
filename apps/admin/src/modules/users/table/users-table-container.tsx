import { pipe } from 'fp-ts/lib/function';

import { tapTaskOption } from '@llm/commons';
import { useAsyncCallback } from '@llm/commons-front';
import { SdkIdNameUrlEntryV, SdKSearchUsersInputV, serializeSdkIdNameUrlEntry, useSdkForLoggedIn } from '@llm/sdk';
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
import { OrganizationsSearchSelect } from '~/modules/organizations';

import { useUserCreateModal } from '../form';
import { UsersTableRow } from './users-table-row';

const SearchUsersUrlFiltersV = SdKSearchUsersInputV
  .omit({
    organizationIds: true,
  })
  .extend({
    organization: SdkIdNameUrlEntryV.optional().nullable(),
  });

export function UsersTableContainer() {
  const { pack } = useI18n();
  const t = pack.table.columns;

  const { sdks } = useSdkForLoggedIn();
  const { loading, pagination, result, reset, reload } = useDebouncedPaginatedSearch({
    schema: SearchUsersUrlFiltersV,
    fallbackSearchParams: {},
    serializeSearchParams: ({ organization, ...filters }) => ({
      ...filters,
      ...organization && {
        organization: serializeSdkIdNameUrlEntry(organization),
      },
    }),
    fetchResultsTask: ({ organization, ...filters }) => sdks.dashboard.users.search({
      ...filters,
      ...organization && {
        organizationIds: [organization.id],
      },
    }),
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
          <>
            <ArchiveFilterTabs {...pagination.bind.path('archived')} />
            <CreateButton loading={createState.isLoading} onClick={onCreate} />
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

        <OrganizationsSearchSelect
          prefix={pack.modules.organizations.prefix.organization}
          {...pagination.bind.path('organization')}
        />
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
