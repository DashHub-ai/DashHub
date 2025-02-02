import camelcaseKeys from 'camelcase-keys';
import esb from 'elastic-builder';
import { array as A, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import type { SdkSearchProjectEmbeddingItemT, SdkSearchProjectEmbeddingsInputT } from '@llm/sdk';
import type { TableId, TableUuid } from '~/modules/database';

import { pluck, rejectFalsyItems } from '@llm/commons';
import { createMagicNullIdEsValue, createPaginationOffsetSearchQuery, createScoredSortFieldQuery } from '~/modules/elasticsearch';
import { createEsPermissionsFilters, mapRawEsDocToSdkPermissions, type WithPermissionsInternalFilters } from '~/modules/permissions';

import { ProjectEmbeddingsTableRowWithRelations } from '../projects-embeddings.tables';
import { type ProjectsEmbeddingsEsDocument, ProjectsEmbeddingsEsIndexRepo } from './projects-embeddings-es-index.repo';

type EsProjectsEmbeddingsInternalFilters =
  WithPermissionsInternalFilters<SdkSearchProjectEmbeddingsInputT>;

export type EsMatchingProjectEmbedding = Pick<
  ProjectEmbeddingsTableRowWithRelations,
  'id' | 'text' | 'projectFile'
>;

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

  search = (dto: EsProjectsEmbeddingsInternalFilters) =>
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
    { embedding, projectsIds, chatId }: {
      embedding: number[];
      projectsIds: TableId[];
      chatId: TableUuid;
    },
  ) => {
    const sharedFilters = [
      esb.termsQuery('project.id', projectsIds),
      esb.boolQuery().should([
        // File attached to message.
        esb.termQuery('project_file.chat.id', chatId),

        // File attached to whole project.
        esb.termQuery('project_file.chat.id', createMagicNullIdEsValue()),
      ]),
    ];

    return pipe(
      this.indexRepo.search(
        esb
          .requestBodySearch()
          .source(['id', 'text', 'project_file', 'project', 'created_at'])
          .size(100)
          .kNN([
            esb
              .kNN(`vector_${embedding.length}`, 30, 200)
              .queryVector(embedding)
              .boost(1)
              .filter([
                esb.termQuery('summary', false),
                ...sharedFilters,
              ]),

            esb
              .kNN(`vector_${embedding.length}`, 20, 200)
              .queryVector(embedding)
              .boost(3)
              .filter([
                esb.termQuery('summary', true),
                ...sharedFilters,
              ]),
          ])
          .toJSON(),
      ),
      TE.map(({ hits: { hits } }) => pipe(
        hits,
        pluck('_source'),

        // kNN tends to return neighboring vectors, so we need to filter out the ones that are not in the list of projects.
        A.filter((item) => {
          if (!projectsIds.includes(item.project!.id)) {
            return false;
          }

          if (item.project_file?.chat?.id) {
            return item.project_file.chat.id === chatId;
          }

          return true;
        }),
        A.map((item): EsMatchingProjectEmbedding => ({
          id: item.id!,
          text: item.text!,
          projectFile: camelcaseKeys(item.project_file!, { deep: true }),
        })),
      )),
    );
  };

  private static mapOutputHit = (source: ProjectsEmbeddingsEsDocument): SdkSearchProjectEmbeddingItemT =>
    ({
      id: source.id,
      createdAt: source.created_at,
      updatedAt: source.updated_at,
      text: source.text,
      project: source.project,
      projectFile: camelcaseKeys(source.project_file, { deep: true }),
      organization: source.organization,
      permissions: mapRawEsDocToSdkPermissions(source.project.permissions),
    });

  private static createEsRequestSearchFilters = (
    {
      ids,
      projectsIds,
      satisfyPermissions,
    }: EsProjectsEmbeddingsInternalFilters,
  ): esb.Query =>
    esb.boolQuery().must(
      rejectFalsyItems([
        !!satisfyPermissions && createEsPermissionsFilters(satisfyPermissions, 'project.permissions'),
        !!ids?.length && esb.termsQuery('id', ids),
        !!projectsIds?.length && esb.termsQuery('project.id', projectsIds),
      ]),
    );
}
