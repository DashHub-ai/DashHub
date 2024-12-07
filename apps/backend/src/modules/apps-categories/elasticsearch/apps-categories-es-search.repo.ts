import esb from 'elastic-builder';
import { array as A, taskEither as TE } from 'fp-ts';
import { flow, pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import type {
  SdkSearchAppCategoryItemT,
  SdKSearchAppsCategoriesInputT,
} from '@llm/sdk';

import { isNil, pluck, rejectFalsyItems } from '@llm/commons';
import {
  createPaginationOffsetSearchQuery,
  createPhraseFieldQuery,
  createScoredSortFieldQuery,
} from '~/modules/elasticsearch';

import {
  AppsCategoriesEsIndexRepo,
  type AppsEsDocument,
} from './apps-categories-es-index.repo';

@injectable()
export class AppsCategoriesEsSearchRepo {
  constructor(
    @inject(AppsCategoriesEsIndexRepo) private readonly indexRepo: AppsCategoriesEsIndexRepo,
  ) {}

  get = flow(
    this.indexRepo.getDocument,
    TE.map(AppsCategoriesEsSearchRepo.mapOutputHit),
  );

  search = (dto: SdKSearchAppsCategoriesInputT) =>
    pipe(
      this.indexRepo.search(
        AppsCategoriesEsSearchRepo.createEsRequestSearchBody(dto).toJSON(),
      ),
      TE.map(({ hits: { total, hits } }) => ({
        items: pipe(
          hits,
          pluck('_source'),
          A.map(item => AppsCategoriesEsSearchRepo.mapOutputHit(item as AppsEsDocument)),
        ),
        total: total.value,
      })),
    );

  private static createEsRequestSearchBody = (dto: SdKSearchAppsCategoriesInputT) =>
    createPaginationOffsetSearchQuery(dto)
      .query(AppsCategoriesEsSearchRepo.createEsRequestSearchFilters(dto))
      .sorts(createScoredSortFieldQuery(dto.sort));

  private static createEsRequestSearchFilters = (
    {
      phrase,
      ids,
      excludeIds,
      archived,
    }: SdKSearchAppsCategoriesInputT,
  ): esb.Query =>
    esb.boolQuery().must(
      rejectFalsyItems([
        !!ids?.length && esb.termsQuery('id', ids),
        !!excludeIds?.length && esb.boolQuery().mustNot(esb.termsQuery('id', excludeIds)),
        !!phrase && (
          esb
            .boolQuery()
            .should([
              createPhraseFieldQuery()(phrase).boost(3),
              esb.matchPhrasePrefixQuery('description', phrase).boost(1.5),
            ])
            .minimumShouldMatch(1)
        ),
        !isNil(archived) && esb.termQuery('archived', archived),
      ]),
    );

  private static mapOutputHit = (source: AppsEsDocument): SdkSearchAppCategoryItemT =>
    ({
      id: source.id,
      name: source.name,
      description: source.description,
      createdAt: source.created_at,
      updatedAt: source.updated_at,
      archived: source.archived,
      icon: source.icon,
      parentCategory: source.parent_category,
    });
}