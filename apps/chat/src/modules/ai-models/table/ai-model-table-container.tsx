import { flow, pipe } from 'fp-ts/lib/function';

import { tapTaskOption } from '@llm/commons';
import { useAsyncCallback } from '@llm/commons-front';
import {
  SdkSearchAIModelsInputV,
  useSdkForLoggedIn,
} from '@llm/sdk';
import { useI18n } from '~/i18n';
import { useWorkspaceOrganizationOrThrow } from '~/modules/workspace';
import {
  ArchiveFilterTabs,
  CreateButton,
  PaginatedTable,
  PaginationSearchToolbarItem,
  PaginationToolbar,
  ResetFiltersButton,
  useDebouncedPaginatedSearch,
} from '~/ui';

import { useAIModelCreateModal } from '../form/create';
import { AIModelsTableRow } from './ai-model-table-row';

export function AIModelsTableContainer() {
  const { pack } = useI18n();
  const t = pack.table.columns;

  const { sdks } = useSdkForLoggedIn();
  const { assignWorkspaceToFilters } = useWorkspaceOrganizationOrThrow();

  const { loading, pagination, result, reset, reload } = useDebouncedPaginatedSearch({
    schema: SdkSearchAIModelsInputV,
    fallbackSearchParams: {},
    storeDataInUrl: false,
    fetchResultsTask: flow(assignWorkspaceToFilters, sdks.dashboard.aiModels.search),
  });

  const createModal = useAIModelCreateModal();
  const [onCreate, createState] = useAsyncCallback(
    pipe(
      createModal.showAsOptional({
        defaultValue: {
          name: '',
          embedding: false,
          credentials: {
            apiKey: '',
            apiModel: '',
          },
          provider: 'openai',
          default: false,
          vision: true,
          description: null,
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
          { id: 'description', name: t.description, className: 'uk-table-expand' },
          {
            id: 'defaultForOrganization',
            name: pack.aiModels.table.columns.defaultForOrganization,
          },
          { id: 'archived', name: t.archived, className: 'w-[150px]' },
          { id: 'createdAt', name: t.createdAt, className: 'w-[200px]' },
          { id: 'updatedAt', name: t.updatedAt, className: 'w-[200px]' },
          { id: 'actions', className: 'uk-table-shrink' },
        ]}
      >
        {({ item }) => (
          <AIModelsTableRow
            key={item.id}
            item={item}
            onUpdated={reload}
          />
        )}
      </PaginatedTable>
    </section>
  );
}
