import { array as A, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import snakecaseKeys from 'snakecase-keys';
import { inject, injectable } from 'tsyringe';

import { tryOrThrowTE } from '@llm/commons';
import {
  createBaseDatedRecordMappings,
  createElasticsearchIndexRepo,
  ElasticsearchRepo,
  type EsDocument,
} from '~/modules/elasticsearch';

import type { ProjectEmbeddingsTableRow } from '../projects-embeddings.tables';

import { ProjectsEmbeddingsRepo } from '../projects-embeddings.repo';

const ProjectsEmbeddingsAbstractEsIndexRepo = createElasticsearchIndexRepo({
  indexName: 'dashboard-projects-embeddings',
  schema: {
    mappings: {
      dynamic: false,
      properties: {
        ...createBaseDatedRecordMappings(),
        summary: {
          type: 'boolean',
        },
        vector: {
          type: 'dense_vector',
          dims: 1536,
        },
      },
    },
    settings: {
      'index.number_of_replicas': 1,
    },
  },
});

export type ProjectsEmbeddingsEsDocument = EsDocument<ProjectEmbeddingsTableRow>;

@injectable()
export class ProjectsEmbeddingsEsIndexRepo extends ProjectsEmbeddingsAbstractEsIndexRepo<ProjectsEmbeddingsEsDocument> {
  constructor(
    @inject(ElasticsearchRepo) elasticsearchRepo: ElasticsearchRepo,
    @inject(ProjectsEmbeddingsRepo) private readonly embeddingsRepo: ProjectsEmbeddingsRepo,
  ) {
    super(elasticsearchRepo);
  }

  protected async findEntities(ids: number[]): Promise<ProjectsEmbeddingsEsDocument[]> {
    return pipe(
      this.embeddingsRepo.findByIds({ ids }),
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
    this.embeddingsRepo.createIdsIterator({
      chunkSize: 20,
    });
}
