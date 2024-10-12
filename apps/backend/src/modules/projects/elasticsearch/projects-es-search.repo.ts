import esb from 'elastic-builder';
import { array as A, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import type {
  SdkSearchProjectItemT,
  SdKSearchProjectsInputT,
} from '@llm/sdk';

import { isNil, pluck, rejectFalsyItems } from '@llm/commons';
import {
  createPaginationOffsetSearchQuery,
  createPhraseFieldQuery,
  createScoredSortFieldQuery,
} from '~/modules/elasticsearch';

import {
  type ProjectsEsDocument,
  ProjectsEsIndexRepo,
} from './projects-es-index.repo';

@injectable()
export class ProjectsEsSearchRepo {
  constructor(
    @inject(ProjectsEsIndexRepo) private readonly indexRepo: ProjectsEsIndexRepo,
  ) {}

  search = (dto: SdKSearchProjectsInputT) =>
    pipe(
      this.indexRepo.search(
        ProjectsEsSearchRepo.createEsRequestSearchBody(dto).toJSON(),
      ),
      TE.map(({ hits: { total, hits } }) => ({
        items: pipe(
          hits,
          pluck('_source'),
          A.map(item => ProjectsEsSearchRepo.mapOutputHit(item as ProjectsEsDocument)),
        ),
        total: total.value,
      })),
    );

  private static createEsRequestSearchBody = (dto: SdKSearchProjectsInputT) =>
    createPaginationOffsetSearchQuery(dto)
      .query(ProjectsEsSearchRepo.createEsRequestSearchFilters(dto))
      .sorts(createScoredSortFieldQuery(dto.sort));

  private static createEsRequestSearchFilters = (
    {
      phrase,
      ids,
      archived,
    }: SdKSearchProjectsInputT,
  ): esb.Query =>
    esb.boolQuery().must(
      rejectFalsyItems([
        !!ids?.length && esb.termsQuery('id', ids),
        !!phrase && createPhraseFieldQuery()(phrase),
        !isNil(archived) && esb.termQuery('archived', archived),
      ]),
    );

  private static mapOutputHit = (source: ProjectsEsDocument): SdkSearchProjectItemT =>
    ({
      id: source.id,
      name: source.name,
      createdAt: source.created_at,
      updatedAt: source.updated_at,
      archived: source.archived,
      organization: source.organization,
    });
}
