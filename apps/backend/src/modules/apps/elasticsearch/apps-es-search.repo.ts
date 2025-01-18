import camelcaseKeys from 'camelcase-keys';
import esb from 'elastic-builder';
import { array as A, taskEither as TE } from 'fp-ts';
import { flow, pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import type {
  SdkCountedIdRecordT,
  SdkSearchAppItemT,
  SdkSearchAppsInputT,
  SdkSearchAppsOutputT,
} from '@llm/sdk';

import { isNil, pluck, rejectFalsyItems } from '@llm/commons';
import { AppsCategoriesEsTreeRepo } from '~/modules/apps-categories/elasticsearch';
import {
  createPaginationOffsetSearchQuery,
  createPhraseFieldQuery,
  createScoredSortFieldQuery,
} from '~/modules/elasticsearch';
import {
  createEsPermissionsFilters,
  mapRawEsDocToSdkPermissions,
  type WithPermissionsInternalFilters,
} from '~/modules/permissions/record-protection';

import {
  type AppsEsDocument,
  AppsEsIndexRepo,
} from './apps-es-index.repo';

export type EsAppsInternalFilters = WithPermissionsInternalFilters<SdkSearchAppsInputT>;

@injectable()
export class AppsEsSearchRepo {
  constructor(
    @inject(AppsEsIndexRepo) private readonly indexRepo: AppsEsIndexRepo,
    @inject(AppsCategoriesEsTreeRepo) private readonly categoriesTreeRepo: AppsCategoriesEsTreeRepo,
  ) {}

  get = flow(
    this.indexRepo.getDocument,
    TE.map(AppsEsSearchRepo.mapOutputHit),
  );

  search = (dto: SdkSearchAppsInputT) => pipe(
    TE.Do,
    TE.bind('query', () => this.indexRepo.search(
      AppsEsSearchRepo.createEsRequestSearchBody(dto).toJSON(),
    )),
    TE.bindW('categoriesAggs', ({ query: { aggregations } }) =>
      this.categoriesTreeRepo.createCountedTree({
        countedAggs: AppsEsSearchRepo.mapCategoriesAggregations(aggregations),
        organizationIds: dto.organizationIds,
      })),
    TE.map(({ categoriesAggs, query: { hits: { total, hits } } }): SdkSearchAppsOutputT => ({
      items: pipe(
        hits,
        pluck('_source'),
        A.map(item => AppsEsSearchRepo.mapOutputHit(item as AppsEsDocument)),
      ),
      total: total.value,
      aggs: {
        categories: categoriesAggs,
      },
    })),
  );

  private static createEsRequestSearchFilters = (
    {
      phrase,
      ids,
      excludeIds,
      organizationIds,
      categoriesIds,
      archived,
      satisfyPermissions,
    }: EsAppsInternalFilters,
  ): esb.Query =>
    esb.boolQuery().must(
      rejectFalsyItems([
        !!satisfyPermissions && createEsPermissionsFilters(satisfyPermissions),
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

  private static createEsRequestSearchBody = (dto: EsAppsInternalFilters) =>
    createPaginationOffsetSearchQuery(dto)
      .query(AppsEsSearchRepo.createEsRequestSearchFilters(dto))
      .aggs([
        esb
          .globalAggregation('global_categories')
          .agg(
            esb
              .filterAggregation('filtered')
              .filter(AppsEsSearchRepo.createEsRequestSearchFilters({
                ...dto,
                categoriesIds: [],
              }))
              .agg(
                esb.termsAggregation('terms', 'category.id'),
              ),
          ),
      ])
      .sorts(createScoredSortFieldQuery(dto.sort));

  private static mapCategoriesAggregations = (aggregations: any) =>
    aggregations.global_categories.filtered.terms.buckets.map((bucket: any): SdkCountedIdRecordT => ({
      id: bucket.key,
      count: bucket.doc_count,
    }));

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
      permissions: mapRawEsDocToSdkPermissions(source.permissions),
      logo: source.logo && camelcaseKeys(source.logo),
    });
}
