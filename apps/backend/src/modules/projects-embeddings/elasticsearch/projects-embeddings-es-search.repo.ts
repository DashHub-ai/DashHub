import camelcaseKeys from 'camelcase-keys';
import esb from 'elastic-builder';
import { array as A, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import type { SdkSearchProjectEmbeddingItemT, SdkSearchProjectEmbeddingsInputT } from '@llm/sdk';
import type { TableId } from '~/modules/database';

import { pluck, rejectFalsyItems } from '@llm/commons';
import { createPaginationOffsetSearchQuery, createScoredSortFieldQuery } from '~/modules/elasticsearch';

import { ProjectEmbeddingsTableRowWithRelations } from '../projects-embeddings.tables';
import { type ProjectsEmbeddingsEsDocument, ProjectsEmbeddingsEsIndexRepo } from './projects-embeddings-es-index.repo';

export type EsMatchingProjectEmbedding = Pick<ProjectEmbeddingsTableRowWithRelations, 'id' | 'text'>;

@injectable()
export class ProjectsEmbeddingsEsSearchRepo {
  constructor(
    @inject(ProjectsEmbeddingsEsIndexRepo) private readonly indexRepo: ProjectsEmbeddingsEsIndexRepo,
  ) {}

  get = (id: TableId) =>
    pipe(
      this.indexRepo.getDocument(id),
      TE.map(ProjectsEmbeddingsEsSearchRepo.mapOutputHit),
    );

  search = (dto: SdkSearchProjectEmbeddingsInputT) =>
    pipe(
      this.indexRepo.search(
        createPaginationOffsetSearchQuery(dto)
          .query(ProjectsEmbeddingsEsSearchRepo.createEsRequestSearchFilters(dto))
          .sorts(createScoredSortFieldQuery(dto.sort))
          .toJSON(),
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

  matchByEmbedding = (
    { embedding, projectId }: {
      embedding: number[];
      projectId: TableId;
    },
  ) => pipe(
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

  private static mapOutputHit = (source: ProjectsEmbeddingsEsDocument): SdkSearchProjectEmbeddingItemT =>
    ({
      id: source.id,
      createdAt: source.created_at,
      updatedAt: source.updated_at,
      text: source.text,
      projectFile: camelcaseKeys(source.project_file, { deep: true }),
    });

  private static createEsRequestSearchFilters = (
    {
      ids,
      projectsIds,
    }: SdkSearchProjectEmbeddingsInputT,
  ): esb.Query =>
    esb.boolQuery().must(
      rejectFalsyItems([
        !!ids?.length && esb.termsQuery('id', ids),
        !!projectsIds?.length && esb.termsQuery('project.id', projectsIds),
      ]),
    );
}
