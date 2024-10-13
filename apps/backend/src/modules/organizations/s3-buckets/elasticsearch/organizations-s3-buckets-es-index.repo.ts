import { array as A, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import snakecaseKeys from 'snakecase-keys';
import { inject, injectable } from 'tsyringe';

import type { NormalizeSelectTableRow, TableId, TableWithIdNameColumn } from '~/modules/database';
import type { S3ResourcesBucketTableRow } from '~/modules/s3';

import { tryOrThrowTE } from '@llm/commons';
import {
  createArchivedRecordMappings,
  createAutocompleteFieldAnalyzeSettings,
  createBaseAutocompleteFieldMappings,
  createBaseDatedRecordMappings,
  createElasticsearchIndexRepo,
  createIdNameObjectMapping,
  ElasticsearchRepo,
  type EsDocument,
} from '~/modules/elasticsearch';

import { OrganizationsS3BucketsRepo } from '../organizations-s3-buckets.repo';

const AbstractEsIndexRepo = createElasticsearchIndexRepo({
  indexName: 'dashboard-s3-buckets',
  schema: {
    mappings: {
      dynamic: false,
      properties: {
        ...createBaseDatedRecordMappings(),
        ...createBaseAutocompleteFieldMappings(),
        ...createArchivedRecordMappings(),
        ...createBaseAutocompleteFieldMappings(),
        organization: createIdNameObjectMapping(),
      },
    },
    settings: {
      'index.number_of_replicas': 1,
      'analysis': createAutocompleteFieldAnalyzeSettings(),
    },
  },
});

export type OrganizationsS3BucketsEsDocument = EsDocument<S3ResourcesBucketTableRow & {
  organization: NormalizeSelectTableRow<TableWithIdNameColumn>;
  default: boolean;
}>;

@injectable()
export class OrganizationsS3BucketsEsIndexRepo extends AbstractEsIndexRepo<OrganizationsS3BucketsEsDocument> {
  constructor(
    @inject(ElasticsearchRepo) elasticsearchRepo: ElasticsearchRepo,
    @inject(OrganizationsS3BucketsRepo) private readonly repo: OrganizationsS3BucketsRepo,
  ) {
    super(elasticsearchRepo);
  }

  reindexAllOrganizationS3Buckets = (organizationId: TableId) => pipe(
    this.repo.createIdsIterator({
      chunkSize: 100,
      organizationId,
    }),
    this.findAndIndexDocumentsByStream,
  )();

  protected async findEntities(ids: number[]): Promise<OrganizationsS3BucketsEsDocument[]> {
    return pipe(
      this.repo.findWithRelationsByIds({ ids }),
      TE.map(
        A.map(({ bucket, organization, default: isDefault }) => ({
          ...snakecaseKeys(bucket, { deep: true }),
          organization,
          default: isDefault,
          _id: String(bucket.id),
        })),
      ),
      tryOrThrowTE,
    )();
  }

  protected createAllEntitiesIdsIterator = () =>
    this.repo.createIdsIterator({
      chunkSize: 100,
    });
}
