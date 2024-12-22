import camelcaseKeys from 'camelcase-keys';
import esb from 'elastic-builder';
import { array as A, taskEither as TE } from 'fp-ts';
import { flow, pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import type {
  SdkSearchProjectFileItemT,
  SdkSearchProjectFilesInputT,
  SdkTableRowIdT,
} from '@llm/sdk';

import { pluck, rejectFalsyItems } from '@llm/commons';
import {
  createPaginationOffsetSearchQuery,
  createPhraseFieldQuery,
  createScoredSortFieldQuery,
} from '~/modules/elasticsearch';

import {
  type ProjectFileEsDocument,
  ProjectsFilesEsIndexRepo,
} from './projects-files-es-index.repo';

type InternalSearchProjectFilesInput = SdkSearchProjectFilesInputT & { projectId: SdkTableRowIdT; };

@injectable()
export class ProjectsFilesEsSearchRepo {
  constructor(
    @inject(ProjectsFilesEsIndexRepo) private readonly indexRepo: ProjectsFilesEsIndexRepo,
  ) {}

  get = flow(
    this.indexRepo.getDocument,
    TE.map(ProjectsFilesEsSearchRepo.mapOutputHit),
  );

  search = (dto: InternalSearchProjectFilesInput) =>
    pipe(
      this.indexRepo.search(
        ProjectsFilesEsSearchRepo.createEsRequestSearchBody(dto).toJSON(),
      ),
      TE.map(({ hits: { total, hits } }) => ({
        items: pipe(
          hits,
          pluck('_source'),
          A.map(item => ProjectsFilesEsSearchRepo.mapOutputHit(item as ProjectFileEsDocument)),
        ),
        total: total.value,
      })),
    );

  private static createEsRequestSearchBody = (dto: InternalSearchProjectFilesInput) =>
    createPaginationOffsetSearchQuery(dto)
      .query(ProjectsFilesEsSearchRepo.createEsRequestSearchFilters(dto))
      .sorts(createScoredSortFieldQuery(dto.sort));

  private static createEsRequestSearchFilters = (
    {
      projectId,
      phrase,
      ids,
    }: InternalSearchProjectFilesInput,
  ): esb.Query =>
    esb.boolQuery().must(
      rejectFalsyItems([
        esb.termQuery('project.id', projectId),
        !!ids?.length && esb.termsQuery('id', ids),
        !!phrase && createPhraseFieldQuery()(phrase).boost(3),
      ]),
    );

  private static mapOutputHit = (source: ProjectFileEsDocument): SdkSearchProjectFileItemT =>
    ({
      id: source.id,
      createdAt: source.created_at,
      updatedAt: source.updated_at,
      project: source.project,
      description: source.description,
      resource: camelcaseKeys(source.resource),
    });
}
