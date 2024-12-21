import esb from 'elastic-builder';
import { array as A, taskEither as TE } from 'fp-ts';
import { flow, pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import type { SdkOffsetPaginationInputT } from '@llm/sdk';
import type { TableId } from '~/modules/database';

import { pluck, rejectFalsyItems } from '@llm/commons';
import {
  createPaginationOffsetSearchQuery,
  createScoredSortFieldQuery,
} from '~/modules/elasticsearch';

import { ProjectEmbeddingsTableRowWithRelations } from '../projects-embeddings.tables';
import {
  type ProjectsEmbeddingsEsDocument,
  ProjectsEmbeddingsEsIndexRepo,
} from './projects-embeddings-es-index.repo';

type InternalSearchEmbeddingsInputT = SdkOffsetPaginationInputT & {
  ids: TableId[];
};

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

  get = flow(
    this.indexRepo.getDocument,
    TE.map(ProjectsEmbeddingsEsSearchRepo.mapOutputHit),
  );

  searchByEmbedding = ({ embedding, projectId }: InternalSearchByEmbeddingInputT) => pipe(
    this.indexRepo.search(
      esb
        .requestBodySearch()
        .source(['id', 'text'])
        .query(
          esb.termQuery('project.id', projectId),
        )
        .kNN(
          esb.kNN('vector', 8, 100).queryVector(embedding),
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

  search = (dto: InternalSearchEmbeddingsInputT) =>
    pipe(
      this.indexRepo.search(
        ProjectsEmbeddingsEsSearchRepo.createEsRequestSearchBody(dto).toJSON(),
      ),
      TE.map(({ hits: { total, hits } }) => ({
        items: pipe(
          hits,
          pluck('_source'),
          A.map(item => ProjectsEmbeddingsEsSearchRepo.mapOutputHit(item as ProjectsEmbeddingsEsDocument)),
        ),
        total: total.value,
      })),
    );

  private static createEsRequestSearchBody = (dto: InternalSearchEmbeddingsInputT) =>
    createPaginationOffsetSearchQuery(dto)
      .query(ProjectsEmbeddingsEsSearchRepo.createEsRequestSearchFilters(dto))
      .sorts(createScoredSortFieldQuery('score:desc'));

  private static createEsRequestSearchFilters = (
    {
      ids,
    }: InternalSearchEmbeddingsInputT,
  ): esb.Query =>
    esb.boolQuery().must(
      rejectFalsyItems([
        !!ids?.length && esb.termsQuery('id', ids),
      ]),
    );

  private static mapOutputHit = (source: ProjectsEmbeddingsEsDocument): ProjectEmbeddingsTableRowWithRelations =>
    ({
      id: source.id,
      createdAt: source.created_at,
      updatedAt: source.updated_at,
      projectFileId: source.project_file_id,
      aiModelId: source.ai_model_id,
      text: source.text,
      vector: source.vector,
      metadata: source.metadata,
      summary: source.summary,
      project: source.project,
    });
}
