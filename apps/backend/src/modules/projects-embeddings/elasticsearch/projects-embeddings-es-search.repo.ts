import esb from 'elastic-builder';
import { array as A, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import type { TableId } from '~/modules/database';

import { pluck } from '@llm/commons';

import { ProjectEmbeddingsTableRowWithRelations } from '../projects-embeddings.tables';
import { ProjectsEmbeddingsEsIndexRepo } from './projects-embeddings-es-index.repo';

export type EsMatchingProjectEmbedding = Pick<ProjectEmbeddingsTableRowWithRelations, 'id' | 'text'>;

type InternalSearchByEmbeddingInputT = {
  embedding: number[];
  projectId: TableId;
};

@injectable()
export class ProjectsEmbeddingsEsSearchRepo {
  constructor(
    @inject(ProjectsEmbeddingsEsIndexRepo) private readonly indexRepo: ProjectsEmbeddingsEsIndexRepo,
  ) {}

  searchByEmbedding = ({ embedding, projectId }: InternalSearchByEmbeddingInputT) => pipe(
    this.indexRepo.search(
      esb
        .requestBodySearch()
        .source(['id', 'text'])
        .query(
          esb.termQuery('project.id', projectId),
        )
        .kNN(
          esb.kNN(`vector_${embedding.length}`, 8, 100).queryVector(embedding),
        )
        .toJSON(),
    ),
    TE.map(({ hits: { hits } }) => pipe(
      hits,
      pluck('_source'),
      A.map((item): EsMatchingProjectEmbedding => ({
        id: item.id!,
        text: item.text!,
      })),
    )),
  );
}
