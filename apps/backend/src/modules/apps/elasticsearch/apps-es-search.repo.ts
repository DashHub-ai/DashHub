import esb from 'elastic-builder';
import { array as A, taskEither as TE } from 'fp-ts';
import { flow, pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import type {
  SdkSearchAppItemT,
  SdkSearchAppsAggsT,
  SdKSearchAppsInputT,
  SdkSearchAppsOutputT,
} from '@llm/sdk';

import { isNil, pluck, rejectFalsyItems } from '@llm/commons';
import {
  createPaginationOffsetSearchQuery,
  createPhraseFieldQuery,
  createScoredSortFieldQuery,
} from '~/modules/elasticsearch';

import {
  type AppsEsDocument,
  AppsEsIndexRepo,
} from './apps-es-index.repo';

@injectable()
export class AppsEsSearchRepo {
  constructor(
    @inject(AppsEsIndexRepo) private readonly indexRepo: AppsEsIndexRepo,
  ) {}

  get = flow(
    this.indexRepo.getDocument,
    TE.map(AppsEsSearchRepo.mapOutputHit),
  );

  search = (dto: SdKSearchAppsInputT) => pipe(
    this.indexRepo.search(
      AppsEsSearchRepo.createEsRequestSearchBody(dto).toJSON(),
    ),
    TE.map(({ hits: { total, hits }, aggregations }): SdkSearchAppsOutputT => ({
      items: pipe(
        hits,
        pluck('_source'),
        A.map(item => AppsEsSearchRepo.mapOutputHit(item as AppsEsDocument)),
      ),
      total: total.value,
      aggs: AppsEsSearchRepo.mapEsAggregations(aggregations),
    })),
  );

  private static createEsRequestSearchBody = (dto: SdKSearchAppsInputT) =>
    createPaginationOffsetSearchQuery(dto)
      .query(AppsEsSearchRepo.createEsRequestSearchFilters(dto))
      .aggs([
        esb.termsAggregation('categories', 'category.id'),
      ])
      .sorts(createScoredSortFieldQuery(dto.sort));

  private static createEsRequestSearchFilters = (
    {
      phrase,
      ids,
      excludeIds,
      organizationIds,
      categoriesIds,
      archived,
    }: SdKSearchAppsInputT,
  ): esb.Query =>
    esb.boolQuery().must(
      rejectFalsyItems([
        !!ids?.length && esb.termsQuery('id', ids),
        !!excludeIds?.length && esb.boolQuery().mustNot(esb.termsQuery('id', excludeIds)),
        !!organizationIds?.length && esb.termsQuery('organization.id', organizationIds),
        !!categoriesIds?.length && esb.termsQuery('category.id', categoriesIds),
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

  private static mapEsAggregations = (aggregations: any): SdkSearchAppsAggsT => ({
    categories: aggregations.categories.buckets.map((bucket: any) => ({
      id: bucket.key,
      count: bucket.doc_count,
    })),
  });

  private static mapOutputHit = (source: AppsEsDocument): SdkSearchAppItemT =>
    ({
      id: source.id,
      name: source.name,
      description: source.description,
      createdAt: source.created_at,
      updatedAt: source.updated_at,
      archived: source.archived,
      organization: source.organization,
      category: source.category,
      chatContext: source.chat_context,
    });
}
