import { flow, pipe } from 'fp-ts/lib/function';

import { tapTaskOption } from '@dashhub/commons';
import { useAsyncCallback } from '@dashhub/commons-front';
import {
  SdkSearchAppsCategoriesInputV,
  useSdkForLoggedIn,
} from '@dashhub/sdk';
import { useI18n } from '~/i18n';
import { useWorkspaceOrganizationOrThrow } from '~/modules/workspace';
import {
  ArchiveFilterTabs,
  CreateButton,
  createFakeSelectItem,
  PaginatedTable,
  PaginationSearchToolbarItem,
  PaginationToolbar,
  ResetFiltersButton,
  useDebouncedPaginatedSearch,
} from '~/ui';

import { useAppCategoryCreateModal } from '../form/create';
import { AppsCategoriesTableRow } from './apps-categories-table-row';

export function AppsCategoriesTableContainer() {
  const { pack } = useI18n();
  const { assignWorkspaceToFilters } = useWorkspaceOrganizationOrThrow();

  const t = pack.table.columns;

  const { sdks } = useSdkForLoggedIn();
  const { loading, pagination, result, reset, reload } = useDebouncedPaginatedSearch({
    storeDataInUrl: false,
    schema: SdkSearchAppsCategoriesInputV,
    fallbackSearchParams: {},
    fetchResultsTask: flow(assignWorkspaceToFilters, sdks.dashboard.appsCategories.search),
  });

  const createModal = useAppCategoryCreateModal();
  const [onCreate, createState] = useAsyncCallback(
    pipe(
      createModal.showAsOptional({
        defaultValue: {
          name: '',
          icon: 'folder',
          parentCategory: null,
          description: '',
          organization: createFakeSelectItem(),
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

        <ResetFiltersButton onClick={reset} />
      </PaginationToolbar>

      <PaginatedTable
        loading={loading}
        pagination={pagination.bind.entire()}
        result={result}
        columns={[
          { id: 'id', name: t.id, className: 'uk-table-shrink' },
          { id: 'name', name: t.name, className: 'uk-table-expand' },
          { id: 'description', name: t.description, className: 'uk-table-expand' },
          { id: 'parentCategory', name: t.parentCategory, className: 'uk-table-expand' },
          { id: 'updatedAt', name: t.updatedAt, className: 'w-[200px]' },
          { id: 'actions', className: 'uk-table-shrink' },
        ]}
      >
        {({ item }) => (
          <AppsCategoriesTableRow
            key={item.id}
            item={item}
            onUpdated={reload}
          />
        )}
      </PaginatedTable>
    </section>
  );
}
