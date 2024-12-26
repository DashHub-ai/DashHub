import esb from 'elastic-builder';
import { array as A, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import snakecaseKeys from 'snakecase-keys';
import { inject, injectable } from 'tsyringe';

import type { TableId } from '~/modules/database';

import { tryOrThrowTE } from '@llm/commons';
import {
  createBaseDatedRecordMappings,
  createElasticsearchIndexRepo,
  createIdObjectMapping,
  createNullableIdObjectMapping,
  ElasticsearchRepo,
  type EsDocument,
} from '~/modules/elasticsearch';

import type { ProjectEmbeddingsTableRowWithRelations } from '../projects-embeddings.tables';

import { ProjectsEmbeddingsRepo } from '../projects-embeddings.repo';

const ProjectsEmbeddingsAbstractEsIndexRepo = createElasticsearchIndexRepo({
  indexName: 'dashboard-projects-embeddings',
  schema: {
    mappings: {
      dynamic: false,
      properties: {
        ...createBaseDatedRecordMappings(),
        project: createIdObjectMapping(),
        project_file: createIdObjectMapping({
          chat: createNullableIdObjectMapping({}, 'keyword'),
          resource: createIdObjectMapping(),
        }),
        summary: { type: 'boolean' },
        text: { type: 'text' },

        // TODO: Find better way to handle unions.
        vector_1536: {
          type: 'dense_vector',
          dims: 1536,
          index: true,
          similarity: 'dot_product',
        },
        vector_1024: {
          type: 'dense_vector',
          dims: 1024,
          index: true,
          similarity: 'dot_product',
        },
        vector_768: {
          type: 'dense_vector',
          dims: 768,
          index: true,
          similarity: 'dot_product',
        },
        vector_512: {
          type: 'dense_vector',
          dims: 512,
          index: true,
          similarity: 'dot_product',
        },
        vector_256: {
          type: 'dense_vector',
          dims: 256,
          index: true,
          similarity: 'dot_product',
        },
      },
    },
    settings: {
      'index.number_of_replicas': 1,
    },
  },
});

export type ProjectsEmbeddingsEsDocument =
  & EsDocument<Omit<ProjectEmbeddingsTableRowWithRelations, 'vector'>>
  & {
    [K in `vector_${number}`]: number[];
  };

@injectable()
export class ProjectsEmbeddingsEsIndexRepo extends ProjectsEmbeddingsAbstractEsIndexRepo<ProjectsEmbeddingsEsDocument> {
  constructor(
    @inject(ElasticsearchRepo) elasticsearchRepo: ElasticsearchRepo,
    @inject(ProjectsEmbeddingsRepo) private readonly embeddingsRepo: ProjectsEmbeddingsRepo,
  ) {
    super(elasticsearchRepo);
  }

  deleteByProjectFileId = (projectFileId: TableId) =>
    this.deleteByQuery(
      esb.termQuery('projectFile.id', projectFileId),
      {
        waitForRecordAvailability: true,
      },
    );

  protected async findEntities(ids: number[]): Promise<ProjectsEmbeddingsEsDocument[]> {
    return pipe(
      this.embeddingsRepo.findWithRelationsByIds({ ids }),
      TE.map(
        A.map(({ vector, projectFile, ...entity }) => {
          const parsedVector: number[] = JSON.parse(vector);

          return {
            ...snakecaseKeys(entity, { deep: true }),
            [`vector_${parsedVector.length}`]: parsedVector,
            project_file: {
              ...snakecaseKeys(projectFile, { deep: true }),
              chat: projectFile.chat ?? ({ id: null } as any),
            },
            _id: String(entity.id),
          };
        }),
      ),
      tryOrThrowTE,
    )();
  }

  protected createAllEntitiesIdsIterator = () =>
    this.embeddingsRepo.createIdsIterator({
      chunkSize: 20,
    });
}
