import { pipe } from 'fp-ts/lib/function';

import { tapTaskOption } from '@llm/commons';
import { useAsyncCallback } from '@llm/commons-front';
import {
  SdkIdNameUrlEntryV,
  SdKSearchAppsInputV,
  serializeSdkIdNameUrlEntry,
  useSdkForLoggedIn,
} from '@llm/sdk';
import {
  ArchiveFilterTabs,
  CreateButton,
  createFakeSelectItem,
  PaginatedTable,
  PaginationSearchToolbarItem,
  PaginationToolbar,
  ResetFiltersButton,
  useDebouncedPaginatedSearch,
} from '@llm/ui';
import { useI18n } from '~/i18n';
import { OrganizationsSearchSelect } from '~/modules/organizations';

import { useAppCategoryCreateModal } from '../form/create';
import { AppsCategoriesTableRow } from './apps-categories-table-row';

const SearchAppsCategoriesUrlFiltersV = SdKSearchAppsInputV
  .omit({
    organizationIds: true,
  })
  .extend({
    organization: SdkIdNameUrlEntryV.optional().nullable(),
  });

export function AppsCategoriesTableContainer() {
  const { pack } = useI18n();
  const t = pack.table.columns;

  const { sdks } = useSdkForLoggedIn();
  const { loading, pagination, result, reset, reload } = useDebouncedPaginatedSearch({
    schema: SearchAppsCategoriesUrlFiltersV,
    fallbackSearchParams: {},
    serializeSearchParams: ({ organization, ...filters }) => ({
      ...filters,
      ...organization && {
        organization: serializeSdkIdNameUrlEntry(organization),
      },
    }),
    fetchResultsTask: ({ organization, ...filters }) => sdks.dashboard.appsCategories.search({
      ...filters,
      ...organization && {
        organizationIds: [organization.id],
      },
    }),
  });

  const createModal = useAppCategoryCreateModal();
  const [onCreate, createState] = useAsyncCallback(
    pipe(
      createModal.showAsOptional({
        defaultValue: {
          name: '',
          icon: 'ellipsis',
          parentCategory: null,
          description: null,
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

        <OrganizationsSearchSelect
          prefix={pack.modules.organizations.prefix.organization}
          {...pagination.bind.path('organization')}
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
          { id: 'organization', name: t.organization, className: 'uk-table-expand' },
          { id: 'archived', name: t.archived, className: 'w-[150px]' },
          { id: 'createdAt', name: t.createdAt, className: 'w-[200px]' },
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
