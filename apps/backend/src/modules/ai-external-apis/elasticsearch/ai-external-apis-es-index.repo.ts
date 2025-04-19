import { array as A, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import snakecaseKeys from 'snakecase-keys';
import { inject, injectable } from 'tsyringe';

import { Overwrite, tryOrThrowTE } from '@llm/commons';
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
import { createPermissionsRowEntryMapping, EsPermissionsDocument } from '~/modules/permissions';

import type { AIExternalAPITableRowWithRelations } from '../ai-external-apis.tables';

import { AIExternalAPIsRepo } from '../ai-external-apis.repo';

const AIExternalAPIsAbstractEsIndexRepo = createElasticsearchIndexRepo({
  indexName: 'dashboard-ai-external-apis',
  schema: {
    mappings: {
      dynamic: false,
      properties: {
        ...createBaseDatedRecordMappings(),
        ...createBaseAutocompleteFieldMappings(),
        ...createArchivedRecordMappings(),
        permissions: createPermissionsRowEntryMapping(),
        organization: createIdNameObjectMapping(),
        description: {
          type: 'text',
          analyzer: 'folded_lowercase_analyzer',
        },
      },
    },
    settings: {
      'index.number_of_replicas': 1,
      'analysis': createAutocompleteFieldAnalyzeSettings(),
    },
  },
});

export type AIExternalAPIsEsDocument = EsDocument<Overwrite<
  AIExternalAPITableRowWithRelations,
  {
    permissions: EsPermissionsDocument;
  }
>>;

@injectable()
export class AIExternalAPIsEsIndexRepo extends AIExternalAPIsAbstractEsIndexRepo<AIExternalAPIsEsDocument> {
  constructor(
    @inject(ElasticsearchRepo) elasticsearchRepo: ElasticsearchRepo,
    @inject(AIExternalAPIsRepo) private readonly aiExternalApisRepo: AIExternalAPIsRepo,
  ) {
    super(elasticsearchRepo);
  }

  protected async findEntities(ids: number[]): Promise<AIExternalAPIsEsDocument[]> {
    return pipe(
      this.aiExternalApisRepo.findWithRelationsByIds({ ids }),
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
    this.aiExternalApisRepo.createIdsIterator({
      chunkSize: 100,
    });
}
