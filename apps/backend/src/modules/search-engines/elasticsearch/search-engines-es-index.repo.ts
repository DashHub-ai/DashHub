import { array as A, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import snakecaseKeys from 'snakecase-keys';
import { inject, injectable } from 'tsyringe';

import type { TableId } from '~/modules/database';

import { tryOrThrowTE } from '@dashhub/commons';
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

import type { SearchEngineTableRowWithRelations } from '../search-engines.tables';

import { SearchEnginesRepo } from '../search-engines.repo';

const SearchEnginesAbstractEsIndexRepo = createElasticsearchIndexRepo({
  indexName: 'dashboard-search-engines',
  schema: {
    mappings: {
      dynamic: false,
      properties: {
        ...createBaseDatedRecordMappings(),
        ...createBaseAutocompleteFieldMappings(),
        ...createArchivedRecordMappings(),
        organization: createIdNameObjectMapping(),
        default: { type: 'boolean' },
      },
    },
    settings: {
      'index.number_of_replicas': 1,
      'analysis': createAutocompleteFieldAnalyzeSettings(),
    },
  },
});

export type SearchEnginesEsDocument = EsDocument<SearchEngineTableRowWithRelations>;

@injectable()
export class SearchEnginesEsIndexRepo extends SearchEnginesAbstractEsIndexRepo<SearchEnginesEsDocument> {
  constructor(
    @inject(ElasticsearchRepo) elasticsearchRepo: ElasticsearchRepo,
    @inject(SearchEnginesRepo) private readonly aiModelsRepo: SearchEnginesRepo,
  ) {
    super(elasticsearchRepo);
  }

  reindexAllOrganizationDocuments = (organizationId: TableId) => pipe(
    this.aiModelsRepo.createIdsIterator({
      chunkSize: 100,
      where: [['organizationId', '=', organizationId]],
    }),
    this.findAndIndexDocumentsByStream,
  )();

  protected async findEntities(ids: number[]): Promise<SearchEnginesEsDocument[]> {
    return pipe(
      this.aiModelsRepo.findWithRelationsByIds({ ids }),
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
    this.aiModelsRepo.createIdsIterator({
      chunkSize: 100,
    });
}
