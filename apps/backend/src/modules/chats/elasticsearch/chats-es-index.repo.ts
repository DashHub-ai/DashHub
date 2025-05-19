import { array as A, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import snakecaseKeys from 'snakecase-keys';
import { inject, injectable } from 'tsyringe';

import { type Overwrite, tryOrThrowTE } from '@dashhub/commons';
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
  EsAIGeneratedField,
  type EsDocument,
} from '~/modules/elasticsearch';
import { createPermissionsRowEntryMapping, type EsPermissionsDocument } from '~/modules/permissions/record-protection';

import type { ChatTableRowWithRelations } from '../chats.tables';

import { ChatsRepo } from '../chats.repo';

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
        permissions: createPermissionsRowEntryMapping(),
        organization: createIdNameObjectMapping(),
        project: createIdNameObjectMapping(),
        creator: createIdObjectMapping(),
        internal: { type: 'boolean' },
        apps: {
          type: 'nested',
          ...createIdObjectMapping(),
        },
        stats: {
          properties: {
            messages: {
              properties: {
                total: { type: 'integer' },
              },
            },
          },
        },
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

export type ChatsEsDocument = EsDocument<Overwrite<
  ChatTableRowWithRelations,
  {
    permissions: EsPermissionsDocument;
    summary: {
      name: EsAIGeneratedField;
      content: EsAIGeneratedField;
    };
  }
>>;

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
        A.map(({ summary, ...entity }): ChatsEsDocument => ({
          ...snakecaseKeys(entity, { deep: true }),
          _id: String(entity.id),
          summary: {
            content: {
              value: summary.content,
              generated: summary.contentGenerated,
              generated_at: summary.contentGeneratedAt,
            },
            name: {
              value: summary.name,
              generated: summary.nameGenerated,
              generated_at: summary.nameGeneratedAt,
            },
          },
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
