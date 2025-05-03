import { array as A, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import snakecaseKeys from 'snakecase-keys';
import { inject, injectable } from 'tsyringe';

import { tryOrThrowTE } from '@llm/commons';
import {
  createArchivedRecordMappings,
  createAutocompleteFieldAnalyzeSettings,
  createBaseAutocompleteFieldMappings,
  createBaseDatedRecordMappings,
  createElasticsearchIndexRepo,
  ElasticsearchRepo,
  type EsDocument,
} from '~/modules/elasticsearch';

import type { OrganizationTableRowWithRelations } from '../organizations.tables';

import { OrganizationsRepo } from '../organizations.repo';

const OrganizationsAbstractEsIndexRepo = createElasticsearchIndexRepo({
  indexName: 'dashboard-organizations',
  schema: {
    mappings: {
      dynamic: false,
      properties: {
        ...createBaseDatedRecordMappings(),
        ...createBaseAutocompleteFieldMappings(),
        ...createArchivedRecordMappings(),
      },
    },
    settings: {
      'index.number_of_replicas': 1,
      'analysis': createAutocompleteFieldAnalyzeSettings(),
    },
  },
});

export type OrganizationsEsDocument = EsDocument<OrganizationTableRowWithRelations>;

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
      this.organizationsRepo.findWithRelationsByIds({ ids }),
      TE.map(
        A.map(entity => ({
          ...snakecaseKeys(entity, { deep: true }),
          _id: String(entity.id),
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
