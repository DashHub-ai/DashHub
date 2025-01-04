import { array as A, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import snakecaseKeys from 'snakecase-keys';
import { inject, injectable } from 'tsyringe';

import type { SdkPermissionResourceT } from '@llm/sdk';

import { tryOrThrowTE } from '@llm/commons';
import {
  createBaseDatedRecordMappings,
  createElasticsearchIndexRepo,
  createIdObjectMapping,
  ElasticsearchRepo,
  type EsDocument,
} from '~/modules/elasticsearch';

import type { PermissionTableRowWithRelations } from '../permissions.tables';

import { PermissionsRepo } from '../permissions.repo';

const PermissionsAbstractEsIndexRepo = createElasticsearchIndexRepo({
  indexName: 'dashboard-permissions',
  schema: {
    mappings: {
      dynamic: false,
      properties: {
        ...createBaseDatedRecordMappings(),
        access_level: { type: 'keyword' },

        project: createIdObjectMapping(),
        app: createIdObjectMapping(),
        chat: createIdObjectMapping({}, 'keyword'),

        user: createIdObjectMapping(),
        group: createIdObjectMapping({
          users: {
            type: 'nested',
            ...createIdObjectMapping({
              email: { type: 'keyword' },
            }),
          },
        }),
      },
    },
    settings: {
      'index.number_of_replicas': 1,
    },
  },
});

export type PermissionsEsDocument = EsDocument<PermissionTableRowWithRelations>;

@injectable()
export class PermissionsEsIndexRepo extends PermissionsAbstractEsIndexRepo<PermissionsEsDocument> {
  constructor(
    @inject(ElasticsearchRepo) elasticsearchRepo: ElasticsearchRepo,
    @inject(PermissionsRepo) private readonly policiesRepo: PermissionsRepo,
  ) {
    super(elasticsearchRepo);
  }

  reindexByResource = (resource: SdkPermissionResourceT) => pipe(
    this.policiesRepo.createResourceIdsIterator({ resource }),
    this.findAndIndexDocumentsByStream,
  )();

  protected async findEntities(ids: number[]): Promise<PermissionsEsDocument[]> {
    return pipe(
      this.policiesRepo.findWithRelationsByIds({ ids }),
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
    this.policiesRepo.createIdsIterator({
      chunkSize: 100,
    });
}
