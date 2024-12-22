import { array as A, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import snakecaseKeys from 'snakecase-keys';
import { inject, injectable } from 'tsyringe';

import type { TableId } from '~/modules/database';

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

import type { AIModelTableRowWithRelations } from '../ai-models.tables';

import { AIModelsRepo } from '../ai-models.repo';

const AIModelsAbstractEsIndexRepo = createElasticsearchIndexRepo({
  indexName: 'dashboard-ai-models',
  schema: {
    mappings: {
      dynamic: false,
      properties: {
        ...createBaseDatedRecordMappings(),
        ...createBaseAutocompleteFieldMappings(),
        ...createArchivedRecordMappings(),
        organization: createIdNameObjectMapping(),
        default: { type: 'boolean' },
        embedding: { type: 'boolean' },
      },
    },
    settings: {
      'index.number_of_replicas': 1,
      'analysis': createAutocompleteFieldAnalyzeSettings(),
    },
  },
});

export type AIModelsEsDocument = EsDocument<AIModelTableRowWithRelations>;

@injectable()
export class AIModelsEsIndexRepo extends AIModelsAbstractEsIndexRepo<AIModelsEsDocument> {
  constructor(
    @inject(ElasticsearchRepo) elasticsearchRepo: ElasticsearchRepo,
    @inject(AIModelsRepo) private readonly aiModelsRepo: AIModelsRepo,
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

  protected async findEntities(ids: number[]): Promise<AIModelsEsDocument[]> {
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
