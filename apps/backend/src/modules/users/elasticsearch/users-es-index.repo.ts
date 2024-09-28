import { array as A, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/function';
import snakecaseKeys from 'snakecase-keys';
import { inject, injectable } from 'tsyringe';

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

import type { UserTableRowWithRelations } from '../users.tables';

import { UsersRepo } from '../users.repo';

const UsersAbstractEsIndexRepo = createElasticsearchIndexRepo({
  indexName: 'dashboard-users',
  schema: {
    mappings: {
      dynamic: false,
      properties: {
        ...createBaseDatedRecordMappings(),
        ...createArchivedRecordMappings(),
        ...createBaseAutocompleteFieldMappings('email'),
        role: { type: 'keyword' },
        email: { type: 'text' },
        active: { type: 'boolean' },
        archive_protection: { type: 'boolean' },
        auth: {
          properties: {
            password: {
              properties: {
                enabled: { type: 'keyword' },
              },
            },
            email: {
              properties: {
                email: { type: 'keyword' },
              },
            },
          },
        },
        organization: createIdNameObjectMapping({
          role: {
            type: 'keyword',
          },
        }),
      },
    },
    settings: {
      'index.number_of_replicas': 1,
      'analysis': createAutocompleteFieldAnalyzeSettings(),
    },
  },
});

export type UsersEsDocument = EsDocument<UserTableRowWithRelations>;

@injectable()
export class UsersEsIndexRepo extends UsersAbstractEsIndexRepo<UsersEsDocument> {
  constructor(
    @inject(ElasticsearchRepo) elasticsearchRepo: ElasticsearchRepo,
    @inject(UsersRepo) private readonly usersRepo: UsersRepo,
  ) {
    super(elasticsearchRepo);
  }

  protected async findEntities(ids: number[]): Promise<UsersEsDocument[]> {
    return pipe(
      this.usersRepo.findWithRelationsByIds({ ids }),
      TE.map(
        A.map(entity => ({
          ...(snakecaseKeys(entity, { deep: true }) as unknown as any),
          _id: entity.id,
          archive_protection: !!entity.archiveProtection,
        })),
      ),
      tryOrThrowTE,
    )();
  }

  protected createAllEntitiesIdsIterator = () =>
    this.usersRepo.createIdsIterator({
      chunkSize: 100,
    });
}
