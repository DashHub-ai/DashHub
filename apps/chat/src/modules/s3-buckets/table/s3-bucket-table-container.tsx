import { flow, pipe } from 'fp-ts/lib/function';

import { tapTaskOption } from '@dashhub/commons';
import { useAsyncCallback } from '@dashhub/commons-front';
import {
  SdkSearchS3BucketsInputV,
  useSdkForLoggedIn,
} from '@dashhub/sdk';
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

import { useS3BucketCreateModal } from '../form/create';
import { S3BucketsTableRow } from './s3-bucket-table-row';

export function S3BucketsTableContainer() {
  const { pack } = useI18n();
  const t = pack.table.columns;

  const { sdks } = useSdkForLoggedIn();
  const { assignWorkspaceToFilters } = useWorkspaceOrganizationOrThrow();

  const { loading, pagination, result, reset, reload } = useDebouncedPaginatedSearch({
    schema: SdkSearchS3BucketsInputV,
    fallbackSearchParams: {},
    fetchResultsTask: flow(assignWorkspaceToFilters, sdks.dashboard.s3Buckets.search),
  });

  const createModal = useS3BucketCreateModal();
  const [onCreate, createState] = useAsyncCallback(
    pipe(
      createModal.showAsOptional({
        defaultValue: {
          name: '',
          accessKeyId: '',
          secretAccessKey: '',
          default: true,
          region: 'eu-central-1',
          port: 9000,
          ssl: false,
          endpoint: '0.0.0.0',
          bucketName: 'default',
          publicBaseUrl: 'http://localhost:9000',
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
          {
            id: 'accessKeyId',
            name: pack.s3Buckets.table.columns.accessKeyId,
            className: 'uk-table-expand',
          },
          {
            id: 'defaultForOrganization',
            name: pack.s3Buckets.table.columns.defaultForOrganization,
          },
          { id: 'archived', name: t.archived, className: 'w-[150px]' },
          { id: 'createdAt', name: t.createdAt, className: 'w-[200px]' },
          { id: 'updatedAt', name: t.updatedAt, className: 'w-[200px]' },
          { id: 'actions', className: 'uk-table-shrink' },
        ]}
      >
        {({ item }) => (
          <S3BucketsTableRow
            key={item.id}
            item={item}
            onUpdated={reload}
          />
        )}
      </PaginatedTable>
    </section>
  );
}
