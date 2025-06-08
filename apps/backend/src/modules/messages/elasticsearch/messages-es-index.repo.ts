import { array as A, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import snakecaseKeys from 'snakecase-keys';
import { inject, injectable } from 'tsyringe';

import type { TableId, TableUuid } from '~/modules/database';

import { tryOrThrowTE } from '@dashhub/commons';
import {
  createAutocompleteFieldAnalyzeSettings,
  createBaseDatedRecordMappings,
  createElasticsearchIndexRepo,
  createIdObjectMapping,
  ElasticsearchRepo,
  type EsDocument,
} from '~/modules/elasticsearch';
import { createPermissionsRowEntryMapping } from '~/modules/permissions';
import { extractAllEmbeddingIdsFromContent } from '~/modules/prompts/embeddings/create-relevant-embeddings-ai-tag';

import type { MessageTableRowWithRelations } from '../messages.tables';

import { MessagesRepo } from '../messages.repo';

const MessagesAbstractEsIndexRepo = createElasticsearchIndexRepo({
  indexName: 'dashboard-messages',
  schema: {
    mappings: {
      dynamic: false,
      properties: {
        ...createBaseDatedRecordMappings({
          uuid: true,
        }),
        chat: createIdObjectMapping(
          {
            creator: createIdObjectMapping(),
            permissions: createPermissionsRowEntryMapping(),
          },
          'keyword',
        ),
        replied_message: createIdObjectMapping({}, 'keyword'),
        creator: createIdObjectMapping(),
        ai_model: createIdObjectMapping(),
        app: createIdObjectMapping(),
        content: {
          type: 'text',
          analyzer: 'folded_lowercase_analyzer',
        },
        embeddings: {
          properties: {
            count: { type: 'integer' },
            ids: { type: 'integer' },
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

export type MessagesEsDocument = EsDocument<MessageTableRowWithRelations> & {
  embeddings: {
    total: number;
    ids: TableId[];
  };
};

@injectable()
export class MessagesEsIndexRepo extends MessagesAbstractEsIndexRepo<MessagesEsDocument> {
  constructor(
    @inject(ElasticsearchRepo) elasticsearchRepo: ElasticsearchRepo,
    @inject(MessagesRepo) private readonly messagesRepo: MessagesRepo,
  ) {
    super(elasticsearchRepo);
  }

  protected async findEntities(ids: TableUuid[]): Promise<MessagesEsDocument[]> {
    return pipe(
      this.messagesRepo.findWithRelationsByIds({ ids }),
      TE.map(
        A.map((entity) => {
          const embeddings = extractAllEmbeddingIdsFromContent(entity.content);

          return {
            ...snakecaseKeys(entity, { deep: true }),
            _id: String(entity.id),
            embeddings: {
              total: embeddings.length,
              ids: embeddings,
            },
          };
        }),
      ),
      tryOrThrowTE,
    )();
  }

  protected createAllEntitiesIdsIterator = () =>
    this.messagesRepo.createIdsIterator({
      chunkSize: 100,
    });
}
