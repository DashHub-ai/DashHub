import { array as A, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import snakecaseKeys from 'snakecase-keys';
import { inject, injectable } from 'tsyringe';

import { tryOrThrowTE } from '@llm/commons';
import { TableUuid } from '~/modules/database';
import {
  createAIGeneratedFieldMappings,
  createArchivedRecordMappings,
  createAutocompleteFieldAnalyzeSettings,
  createBaseAutocompleteFieldMappings,
  createBaseDatedRecordMappings,
  createElasticsearchIndexRepo,
  createIdNameObjectMapping,
  createIdObjectMapping,
  ElasticsearchRepo,
  type EsDocument,
} from '~/modules/elasticsearch';

import type { ChatTableRowWithRelations } from '../chats.tables';

import { ChatsRepo } from '../repo/chats.repo';

const ChatsAbstractEsIndexRepo = createElasticsearchIndexRepo({
  indexName: 'dashboard-chats',
  schema: {
    mappings: {
      dynamic: false,
      properties: {
        ...createBaseDatedRecordMappings({
          uuid: true,
        }),
        ...createArchivedRecordMappings(),
        organization: createIdNameObjectMapping(),
        creator: createIdObjectMapping(),
        summary: {
          properties: {
            name: createAIGeneratedFieldMappings(
              createBaseAutocompleteFieldMappings('value'),
            ),
            content: createAIGeneratedFieldMappings(),
          },
        },
      },
    },
    settings: {
      'index.number_of_replicas': 1,
      'analysis': createAutocompleteFieldAnalyzeSettings(),
    },
  },
});

export type ChatsEsDocument = EsDocument<ChatTableRowWithRelations>;

@injectable()
export class ChatsEsIndexRepo extends ChatsAbstractEsIndexRepo<ChatsEsDocument> {
  constructor(
    @inject(ElasticsearchRepo) elasticsearchRepo: ElasticsearchRepo,
    @inject(ChatsRepo) private readonly chatsRepo: ChatsRepo,
  ) {
    super(elasticsearchRepo);
  }

  protected async findEntities(ids: TableUuid[]): Promise<ChatsEsDocument[]> {
    return pipe(
      this.chatsRepo.findWithRelationsByIds({ ids }),
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
    this.chatsRepo.createIdsIterator({
      chunkSize: 30,
    });
}
