import { array as A, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import snakecaseKeys from 'snakecase-keys';
import { inject, injectable } from 'tsyringe';

import { tryOrThrowTE } from '@llm/commons';
import {
  createBaseDatedRecordMappings,
  createElasticsearchIndexRepo,
  createIdObjectMapping,
  ElasticsearchRepo,
  type EsDocument,
} from '~/modules/elasticsearch';

import type { ProjectPolicyTableRowWithRelations } from '../projects-policies.tables';

import { ProjectsPoliciesRepo } from '../projects-policies.repo';

const ProjectsPoliciesAbstractEsIndexRepo = createElasticsearchIndexRepo({
  indexName: 'dashboard-projects-policies',
  schema: {
    mappings: {
      dynamic: false,
      properties: {
        ...createBaseDatedRecordMappings(),
        project: createIdObjectMapping(),
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

export type ProjectsPoliciesEsDocument = EsDocument<ProjectPolicyTableRowWithRelations>;

@injectable()
export class ProjectsPoliciesEsIndexRepo extends ProjectsPoliciesAbstractEsIndexRepo<ProjectsPoliciesEsDocument> {
  constructor(
    @inject(ElasticsearchRepo) elasticsearchRepo: ElasticsearchRepo,
    @inject(ProjectsPoliciesRepo) private readonly policiesRepo: ProjectsPoliciesRepo,
  ) {
    super(elasticsearchRepo);
  }

  protected async findEntities(ids: number[]): Promise<ProjectsPoliciesEsDocument[]> {
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
