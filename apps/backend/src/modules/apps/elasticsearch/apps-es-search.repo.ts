import camelcaseKeys from 'camelcase-keys';
import esb from 'elastic-builder';
import { array as A, taskEither as TE } from 'fp-ts';
import { flow, pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import type {
  SdkAppsSortT,
  SdkCountedIdRecordT,
  SdkSearchAppItemT,
  SdkSearchAppsInputT,
  SdkSearchAppsOutputT,
} from '@llm/sdk';
import type { TableId } from '~/modules/database';

import { isNil, type Nullable, pluck, pluckIds, rejectFalsyItems, uniq } from '@llm/commons';
import { AppsCategoriesEsTreeRepo } from '~/modules/apps-categories/elasticsearch';
import {
  createPaginationOffsetSearchQuery,
  createPhraseFieldQuery,
  createScoredSortFieldQuery,
  createSortFieldQuery,
} from '~/modules/elasticsearch';
import {
  createEsPermissionsFilters,
  mapRawEsDocToSdkPermissions,
  type WithPermissionsInternalFilters,
} from '~/modules/permissions/record-protection';
import { UsersFavoritesRepo } from '~/modules/users-favorites/users-favorites.repo';

import {
  type AppsEsDocument,
  AppsEsIndexRepo,
} from './apps-es-index.repo';

export type EsAppsInternalFilters =
  & WithPermissionsInternalFilters<SdkSearchAppsInputT>
  & {
    favoritesAgg?: {
      userId: TableId;
    };
  };

@injectable()
export class AppsEsSearchRepo {
  constructor(
    @inject(AppsEsIndexRepo) private readonly indexRepo: AppsEsIndexRepo,
    @inject(AppsCategoriesEsTreeRepo) private readonly categoriesTreeRepo: AppsCategoriesEsTreeRepo,
    @inject(UsersFavoritesRepo) private readonly usersFavoritesRepo: UsersFavoritesRepo,
  ) {}

  get = flow(
    this.indexRepo.getDocument,
    TE.map(AppsEsSearchRepo.mapOutputHit),
  );

  search = (dto: EsAppsInternalFilters) => pipe(
    TE.Do,
    TE.bind('query', () => pipe(
      this.createEsRequestSearchBody(dto),
      TE.chainW(query => this.indexRepo.search(query.toJSON())),
    )),
    TE.bindW('categoriesAggs', ({ query: { aggregations } }) =>
      this.categoriesTreeRepo.createCountedTree({
        countedAggs: AppsEsSearchRepo.mapCategoriesAggregations(aggregations),
        organizationIds: dto.organizationIds,
      })),
    TE.map(({ categoriesAggs, query: { aggregations, hits: { total, hits } } }): SdkSearchAppsOutputT => ({
      items: pipe(
        hits,
        pluck('_source'),
        A.map(item => AppsEsSearchRepo.mapOutputHit(item as AppsEsDocument)),
      ),
      total: total.value,
      aggs: {
        categories: categoriesAggs,
        favorites: {
          count: (aggregations as any)?.total_favorites?.filtered?.doc_count ?? 0,
        },
      },
    })),
  );

  private readonly createEsRequestSearchBody = ({ favoritesAgg, ...dto }: EsAppsInternalFilters) =>
    pipe(
      TE.Do,
      TE.bind('favorites', () =>
        favoritesAgg
          ? this.usersFavoritesRepo.findAll({
              type: 'app',
              userId: favoritesAgg.userId,
            })
          : TE.right([])),
      TE.bind('filtersWithMaybeFavorites', ({ favorites }) => {
        if (!favorites.length || !dto.favorites) {
          return TE.right(dto);
        }

        return TE.right({
          ...dto,
          ids: [
            ...(dto.ids ?? []),
            ...pluckIds(favorites) as number[],
          ],
        });
      }),
      TE.map(({ favorites, filtersWithMaybeFavorites }) =>
        createPaginationOffsetSearchQuery(filtersWithMaybeFavorites)
          .query(AppsEsSearchRepo.createEsRequestSearchFilters(filtersWithMaybeFavorites))
          .aggs([
            // Categories are not affected by the favorite filters,
            // as the favorite filters pretends to be fake category
            esb
              .globalAggregation('global_categories')
              .agg(
                esb
                  .filterAggregation('filtered')
                  .filter(
                    AppsEsSearchRepo.createEsRequestSearchFilters({
                      ...dto,
                      categoriesIds: [],
                    }),
                  )
                  .agg(
                    esb
                      .termsAggregation('terms', 'category.id')
                      .size(40),
                  ),
              ),

            ...favorites.length
              ? [
                  esb
                    .globalAggregation('total_favorites')
                    .agg(
                      esb
                        .filterAggregation('filtered')
                        .filter(
                          AppsEsSearchRepo.createEsRequestSearchFilters({
                            ...filtersWithMaybeFavorites,
                            categoriesIds: [],
                            ids: uniq([
                              ...filtersWithMaybeFavorites.ids ?? [],
                              ...pluckIds(favorites) as number[],
                            ]),
                          }),
                        ),
                    ),
                ]
              : [],
          ])
          .sorts(AppsEsSearchRepo.createAppsSortFieldQuery(dto.sort))),
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

  private static createAppsSortFieldQuery = (sort: Nullable<SdkAppsSortT>) => {
    switch (sort) {
      case undefined:
      case null:
      case 'promotion:desc':
        return [
          esb.sort('promotion', 'desc'),
          createSortFieldQuery('createdAt:desc'),
        ];

      default:
        return createScoredSortFieldQuery(sort);
    }
  };

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
      project: source.project,
      permissions: mapRawEsDocToSdkPermissions(source.permissions),
      logo: source.logo && camelcaseKeys(source.logo),
      aiModel: source.ai_model,
      promotion: source.promotion,
    });
}
