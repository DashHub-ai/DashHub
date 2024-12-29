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
  createIdNameObjectMapping,
  ElasticsearchRepo,
  type EsDocument,
} from '~/modules/elasticsearch';

import type { UsersGroupTableRowWithRelations } from '../users-groups.tables';

import { UsersGroupsRepo } from '../repo/users-groups.repo';

const UsersGroupsAbstractEsIndexRepo = createElasticsearchIndexRepo({
  indexName: 'dashboard-users-groups',
  schema: {
    mappings: {
      dynamic: false,
      properties: {
        ...createBaseDatedRecordMappings(),
        ...createBaseAutocompleteFieldMappings(),
        ...createArchivedRecordMappings(),
        organization: createIdNameObjectMapping(),
      },
    },
    settings: {
      'index.number_of_replicas': 1,
      'analysis': createAutocompleteFieldAnalyzeSettings(),
    },
  },
});

export type UsersGroupsEsDocument = EsDocument<UsersGroupTableRowWithRelations>;

@injectable()
export class UsersGroupsEsIndexRepo extends UsersGroupsAbstractEsIndexRepo<UsersGroupsEsDocument> {
  constructor(
    @inject(ElasticsearchRepo) elasticsearchRepo: ElasticsearchRepo,
    @inject(UsersGroupsRepo) private readonly usersGroupsRepo: UsersGroupsRepo,
  ) {
    super(elasticsearchRepo);
  }

  protected async findEntities(ids: number[]): Promise<UsersGroupsEsDocument[]> {
    return pipe(
      this.usersGroupsRepo.findWithRelationsByIds({ ids }),
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
    this.usersGroupsRepo.createIdsIterator({
      chunkSize: 100,
    });
}
