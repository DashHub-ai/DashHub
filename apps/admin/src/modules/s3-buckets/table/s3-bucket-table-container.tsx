import type { z } from 'zod';

import { pipe } from 'fp-ts/lib/function';

import { tapTaskOption } from '@llm/commons';
import { useAsyncCallback } from '@llm/commons-front';
import {
  SdkIdNameUrlEntryV,
  SdKSearchS3BucketsInputV,
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

import { useS3BucketCreateModal } from '../form/create';
import { S3BucketsTableRow } from './s3-bucket-table-row';

const SearchUsersUrlFiltersV = SdKSearchS3BucketsInputV
  .omit({
    organizationIds: true,
  })
  .extend({
    organization: SdkIdNameUrlEntryV.optional().nullable(),
  });

export type SearchS3BucketsRouteUrlFiltersT = z.input<typeof SearchUsersUrlFiltersV>;

export function S3BucketsTableContainer() {
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
    fetchResultsTask: ({ organization, ...filters }) => sdks.dashboard.s3Buckets.search({
      ...filters,
      ...organization && {
        organizationIds: [organization.id],
      },
    }),
  });

  const createModal = useS3BucketCreateModal();
  const [onCreate, createState] = useAsyncCallback(
    pipe(
      createModal.showAsOptional({
        defaultValue: {
          name: '',
          organization: createFakeSelectItem(),
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
          {
            id: 'accessKeyId',
            name: pack.modules.s3Buckets.table.columns.accessKeyId,
            className: 'uk-table-expand',
          },
          { id: 'organization', name: t.organization, className: 'uk-table-expand' },
          {
            id: 'defaultForOrganization',
            name: pack.modules.s3Buckets.table.columns.defaultForOrganization,
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
