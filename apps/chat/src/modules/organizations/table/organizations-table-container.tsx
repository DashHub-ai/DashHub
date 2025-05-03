import type { z } from 'zod';

import { pipe } from 'fp-ts/lib/function';

import { tapTaskOption } from '@llm/commons';
import { useAsyncCallback } from '@llm/commons-front';
import { SdkSearchOrganizationsInputV, useSdkForLoggedIn } from '@llm/sdk';
import { useI18n } from '~/i18n';
import {
  ArchiveFilterTabs,
  CreateButton,
  PaginatedTable,
  PaginationSearchToolbarItem,
  PaginationToolbar,
  ResetFiltersButton,
  useDebouncedPaginatedSearch,
} from '~/ui';

import { useOrganizationCreateModal } from '../form/create';
import { OrganizationsTableRow } from './organizations-table-row';

export type SearchOrganizationsRouteUrlFiltersT = z.input<typeof SdkSearchOrganizationsInputV>;

export function OrganizationsTableContainer() {
  const t = useI18n().pack.table.columns;
  const { sdks } = useSdkForLoggedIn();

  const { loading, pagination, result, reset, reload } = useDebouncedPaginatedSearch({
    schema: SdkSearchOrganizationsInputV,
    storeDataInUrl: false,
    fallbackSearchParams: {},
    fetchResultsTask: sdks.dashboard.organizations.search,
  });

  const createModal = useOrganizationCreateModal();
  const [onCreate, createState] = useAsyncCallback(
    pipe(
      createModal.showAsOptional({
        defaultValue: {
          name: '',
          aiSettings: {
            chatContext: null,
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
