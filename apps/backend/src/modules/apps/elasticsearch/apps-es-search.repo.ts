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

import {
  groupByFlatProp,
  isNil,
  type Nullable,
  type Overwrite,
  pluck,
  pluckIds,
  rejectFalsyItems,
  uniq,
} from '@llm/commons';
import { AppsCategoriesEsTreeRepo } from '~/modules/apps-categories/elasticsearch';
import {
  createPaginationOffsetSearchQuery,
  createPhraseFieldQuery,
  createScoredSortFieldQuery,
  createSortByIdsOrderScript,
  createSortFieldQuery,
} from '~/modules/elasticsearch';
import {
  createEsPermissionsFilters,
  mapRawEsDocToSdkPermissions,
  type WithPermissionsInternalFilters,
} from '~/modules/permissions/record-protection';
import { UsersFavoritesRepo } from '~/modules/users-favorites/users-favorites.repo';

import { AppsRepo } from '../apps.repo';
import {
  type AppsEsDocument,
  AppsEsIndexRepo,
} from './apps-es-index.repo';

export type EsAppsInternalFilters = Overwrite<
  WithPermissionsInternalFilters<SdkSearchAppsInputT>,
  {
    personalization?: {
      userId: TableId;
    };
  }
>;

@injectable()
export class AppsEsSearchRepo {
  constructor(
    @inject(AppsEsIndexRepo) private readonly indexRepo: AppsEsIndexRepo,
    @inject(AppsCategoriesEsTreeRepo) private readonly categoriesTreeRepo: AppsCategoriesEsTreeRepo,
    @inject(AppsRepo) private readonly appsRepo: AppsRepo,
    @inject(UsersFavoritesRepo) private readonly usersFavoritesRepo: UsersFavoritesRepo,
  ) {}

  get = flow(
    this.indexRepo.getDocument,
    TE.map(AppsEsSearchRepo.mapOutputHit),
  );

  search = (dto: EsAppsInternalFilters) => pipe(
    this.createEsRequestSearchBody(dto),
    TE.bindW('query', ({ searchBody }) => this.indexRepo.search(searchBody.toJSON())),
    TE.bindW('categoriesAggs', ({ query: { aggregations } }) =>
      this.categoriesTreeRepo.createCountedTree({
        countedAggs: AppsEsSearchRepo.mapCategoriesAggregations(aggregations),
        organizationIds: dto.organizationIds,
      })),
    TE.map((
      {
        recentlyUsedApps,
        categoriesAggs,
        query: { aggregations, hits: { total, hits } },
      },
    ): SdkSearchAppsOutputT => {
      const recentChatsMap = pipe(
        recentlyUsedApps,
        groupByFlatProp('id'),
      );

      return {
        items: pipe(
          hits,
          pluck('_source'),
          A.map(item => ({
            ...AppsEsSearchRepo.mapOutputHit(item as AppsEsDocument),
            recentChats: (recentChatsMap[item.id!]?.chatIds ?? []).map(id => ({
              id,
            })),
          })),
        ),
        total: total.value,
        aggs: {
          categories: categoriesAggs,
          favorites: {
            count: (aggregations as any)?.total_favorites?.filtered?.doc_count ?? 0,
          },
          recentlyUsed: {
            count: (aggregations as any)?.total_recently_used?.filtered?.doc_count ?? 0,
          },
        },
      };
    }),
  );

  private readonly createEsRequestSearchBody = (
    {
      favoritesAgg,
      recentAgg,
      personalization,
      ...dto
    }: EsAppsInternalFilters,
  ) =>
    pipe(
      TE.Do,
      TE.apSW('favoritesIds', (dto.sort === 'favorites:desc' || dto.favorites || favoritesAgg) && personalization
        ? pipe(
            this.usersFavoritesRepo.findAll({
              type: 'app',
              userId: personalization.userId,
            }),
            TE.map(favorites => pluckIds(favorites) as TableId[]),
          )
        : TE.right([])),

      TE.apSW('recentlyUsedApps', (dto.sort === 'recently-used:desc' || dto.recent || recentAgg || dto.includeRecentChats) && personalization
        ? this.appsRepo.findAllRecentlyUsedApps({
            userId: personalization.userId,
          })
        : TE.right([])),

      TE.bind('extendedFilters', ({ favoritesIds, recentlyUsedApps }) => {
        if (!dto.favorites && !dto.recent) {
          return TE.right(dto);
        }

        return TE.right({
          ...dto,
          ids: [
            // trick for making the `ids` query generator always generate ids term query even if array is empty.
            // It'll make the query work properly when there is no favorites.
            -2,
            ...dto.recent ? pluckIds(recentlyUsedApps) : [],
            ...dto.favorites ? favoritesIds : [],
          ],
        });
      }),
      TE.map(({ favoritesIds, recentlyUsedApps, extendedFilters }) => {
        const searchBody = createPaginationOffsetSearchQuery(extendedFilters)
          .query(AppsEsSearchRepo.createEsRequestSearchFilters(extendedFilters))
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

            ...recentlyUsedApps.length
              ? [
                  esb
                    .globalAggregation('total_recently_used')
                    .agg(
                      esb
                        .filterAggregation('filtered')
                        .filter(
                          AppsEsSearchRepo.createEsRequestSearchFilters({
                            ...extendedFilters,
                            categoriesIds: [],
                            ids: pipe(
                              recentlyUsedApps,
                              pluckIds,
                              uniq,
                            ),
                          }),
                        ),
                    ),
                ]
              : [],

            ...favoritesIds.length
              ? [
                  esb
                    .globalAggregation('total_favorites')
                    .agg(
                      esb
                        .filterAggregation('filtered')
                        .filter(
                          AppsEsSearchRepo.createEsRequestSearchFilters({
                            ...extendedFilters,
                            categoriesIds: [],
                            ids: uniq(favoritesIds),
                          }),
                        ),
                    ),
                ]
              : [],
          ])
          .sorts(AppsEsSearchRepo.createAppsSortFieldQuery(dto.sort, extendedFilters.ids));

        return {
          recentlyUsedApps,
          searchBody,
        };
      }),
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

  private static createAppsSortFieldQuery = (sort: Nullable<SdkAppsSortT>, ids?: TableId[]) => {
    switch (sort) {
      case undefined:
      case null:
      case 'promotion:desc':
        return [
          esb.sort('promotion', 'desc'),
          createSortFieldQuery('createdAt:desc'),
        ];

      case 'recently-used:desc':
        if (ids?.length) {
          return [
            createSortByIdsOrderScript(ids),
          ];
        }

        return createScoredSortFieldQuery('createdAt:desc');

      case 'favorites:desc':
        if (ids?.length) {
          return [
            createSortByIdsOrderScript(ids),
          ];
        }

        return createScoredSortFieldQuery('createdAt:desc');

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
      recentChats: [],
    });
}
