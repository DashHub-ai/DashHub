import { array as A, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/function';
import snakecaseKeys from 'snakecase-keys';
import { inject, injectable } from 'tsyringe';

import { tryOrThrowTE } from '@llm/commons';
import {
  createAutocompleteFieldAnalyzeSettings,
  createBaseAutocompleteFieldMappings,
  createBaseDatedRecordMappings,
  createElasticsearchIndexRepo,
  ElasticsearchRepo,
  type EsDocument,
} from '~/modules/elasticsearch';

import type { OrganizationTableRow } from '../organizations.tables';

import { OrganizationsRepo } from '../organizations.repo';

const OrganizationsAbstractEsIndexRepo = createElasticsearchIndexRepo({
  indexName: 'dashboard-organizations',
  schema: {
    mappings: {
      dynamic: false,
      properties: {
        ...createBaseDatedRecordMappings(),
        ...createBaseAutocompleteFieldMappings(),
        max_number_of_users: { type: 'integer' },
      },
    },
    settings: {
      'index.number_of_replicas': 1,
      'analysis': createAutocompleteFieldAnalyzeSettings(),
    },
  },
});

export type OrganizationsEsDocument = EsDocument<OrganizationTableRow>;

@injectable()
export class OrganizationsEsIndexRepo extends OrganizationsAbstractEsIndexRepo<OrganizationsEsDocument> {
  constructor(
    @inject(ElasticsearchRepo) elasticsearchRepo: ElasticsearchRepo,
    @inject(OrganizationsRepo) private readonly organizationsRepo: OrganizationsRepo,
  ) {
    super(elasticsearchRepo);
  }

  protected async findEntities(ids: number[]): Promise<OrganizationsEsDocument[]> {
    return pipe(
      this.organizationsRepo.findByIds({ ids }),
      TE.map(
        A.map(entity => ({
          ...(snakecaseKeys(entity, { deep: true }) as unknown as any),
          _id: entity.id,
        })),
      ),
      tryOrThrowTE,
    )();
  }

  protected createAllEntitiesIdsIterator = () =>
    this.organizationsRepo.createIdsIterator({
      chunkSize: 100,
    });
}
