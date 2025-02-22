import { array as A, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import snakecaseKeys from 'snakecase-keys';
import { inject, injectable } from 'tsyringe';

import { tryOrThrowTE } from '@llm/commons';
import {
  createAutocompleteFieldAnalyzeSettings,
  createBaseAutocompleteFieldMappings,
  createBaseDatedRecordMappings,
  createElasticsearchIndexRepo,
  createIdNameObjectMapping,
  createIdObjectMapping,
  ElasticsearchRepo,
  type EsDocument,
} from '~/modules/elasticsearch';

import type { PinnedMessageTableRowWithRelations } from '../pinned-messages.tables';

import { PinnedMessagesRepo } from '../pinned-messages.repo';

const PinnedMessagesAbstractEsIndexRepo = createElasticsearchIndexRepo({
  indexName: 'dashboard-pinned-messages',
  schema: {
    mappings: {
      dynamic: false,
      properties: {
        ...createBaseDatedRecordMappings(),
        creator: createIdNameObjectMapping(),
        message: createIdObjectMapping(
          createBaseAutocompleteFieldMappings('content'),
          'keyword',
        ),
      },
    },
    settings: {
      'index.number_of_replicas': 1,
      'analysis': createAutocompleteFieldAnalyzeSettings(),
    },
  },
});

export type PinnedMessagesEsDocument = EsDocument<PinnedMessageTableRowWithRelations>;

@injectable()
export class PinnedMessagesEsIndexRepo extends PinnedMessagesAbstractEsIndexRepo<PinnedMessagesEsDocument> {
  constructor(
    @inject(ElasticsearchRepo) elasticsearchRepo: ElasticsearchRepo,
    @inject(PinnedMessagesRepo) private readonly pinnedMessagesRepo: PinnedMessagesRepo,
  ) {
    super(elasticsearchRepo);
  }

  protected async findEntities(ids: number[]): Promise<PinnedMessagesEsDocument[]> {
    return pipe(
      this.pinnedMessagesRepo.findWithRelationsByIds({ ids }),
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
    this.pinnedMessagesRepo.createIdsIterator({
      chunkSize: 100,
    });
}
