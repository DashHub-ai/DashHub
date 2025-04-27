import esb from 'elastic-builder';
import { array as A, taskEither as TE } from 'fp-ts';
import { flow, pipe } from 'fp-ts/lib/function';
import { Nullable } from 'kysely';
import { inject, injectable } from 'tsyringe';

import type {
  SdkChatsSortT,
  SdkSearchChatItemT,
  SdkSearchChatsInputT,
} from '@llm/sdk';
import type { TableId, TableUuid } from '~/modules/database';

import { isNil, pluck, pluckIds, rejectFalsyItems } from '@llm/commons';
import {
  createPaginationOffsetSearchQuery,
  createPhraseFieldQuery,
  createScoredSortFieldQuery,
  createSortByIdsOrderScript,
} from '~/modules/elasticsearch';
import {
  createEsPermissionsFilters,
  mapRawEsDocToSdkPermissions,
  type WithPermissionsInternalFilters,
} from '~/modules/permissions/record-protection';
import { UsersFavoritesRepo } from '~/modules/users-favorites/users-favorites.repo';

import {
  type ChatsEsDocument,
  ChatsEsIndexRepo,
} from './chats-es-index.repo';

type EsChatsInternalFilters =
  & WithPermissionsInternalFilters<SdkSearchChatsInputT>
  & {
    internal?: boolean;
    customization?: {
      userId: TableId;
    };
  };

@injectable()
export class ChatsEsSearchRepo {
  constructor(
    @inject(ChatsEsIndexRepo) private readonly indexRepo: ChatsEsIndexRepo,
    @inject(UsersFavoritesRepo) private readonly usersFavoritesRepo: UsersFavoritesRepo,
  ) {}

  get = flow(
    this.indexRepo.getDocument,
    TE.map(ChatsEsSearchRepo.mapOutputHit),
  );

  search = (dto: EsChatsInternalFilters) => pipe(
    TE.Do,
    TE.bind('query', () => pipe(
      this.createEsRequestSearchBody(dto),
      TE.chainW(query => this.indexRepo.search(query.toJSON())),
    )),
    TE.map(({ query: { hits: { total, hits } } }) => ({
      items: pipe(
        hits,
        pluck('_source'),
        A.map(item => ChatsEsSearchRepo.mapOutputHit(item as ChatsEsDocument)),
      ),
      total: total.value,
    })),
  );

  private createEsRequestSearchBody = ({ customization, favorites, ...dto }: EsChatsInternalFilters) =>
    pipe(
      TE.Do,
      TE.bind('favoritesIds', () => {
        if (!customization?.userId || (!dto.sort?.includes('favorites') && !favorites)) {
          return TE.right(null);
        }

        return pipe(
          this.usersFavoritesRepo.findAll({
            type: 'chat',
            userId: customization.userId,
          }),
          TE.map(items => pluckIds(items) as TableUuid[]),
        );
      }),
      TE.bind('mappedFilters', ({ favoritesIds }) => {
        if (!favorites) {
          return TE.right(dto);
        }

        return TE.right({
          ...dto,
          ids: [
            // trick for making the `ids` query generator always generate ids term query even if array is empty.
            // It'll make the query work properly when there is no favorites.
            '',
            ...(dto.ids ?? []),
            ...favoritesIds || [],
          ],
        });
      }),
      TE.map(({ mappedFilters, favoritesIds }) =>
        createPaginationOffsetSearchQuery(mappedFilters)
          .query(ChatsEsSearchRepo.createEsRequestSearchFilters(mappedFilters))
          .sorts(ChatsEsSearchRepo.createChatsSortFieldQuery(mappedFilters.sort, favoritesIds || [])),
      ),
    );

  private static createEsRequestSearchFilters = (
    {
      phrase,
      ids,
      organizationIds,
      projectsIds,
      creatorIds,
      archived,
      excludeEmpty,
      satisfyPermissions,
      internal,
    }: EsChatsInternalFilters,
  ): esb.Query =>
    esb.boolQuery().must(
      rejectFalsyItems([
        esb.termsQuery('internal', internal ?? false),
        !!satisfyPermissions && createEsPermissionsFilters(satisfyPermissions),
        !!ids?.length && esb.termsQuery('id', ids),
        !!projectsIds?.length && esb.termsQuery('project.id', projectsIds),
        !!creatorIds?.length && esb.termsQuery('creator.id', creatorIds),
        !!organizationIds?.length && esb.termsQuery('organization.id', organizationIds),
        !!excludeEmpty && esb.rangeQuery('stats.messages.total').gt(0),
        !!phrase && (
          esb
            .boolQuery()
            .should([
              createPhraseFieldQuery('summary.name.value')(phrase).boost(3),
              esb.matchPhrasePrefixQuery('summary.content.value', phrase).boost(1.5),
            ])
            .minimumShouldMatch(1)
        ),
        !isNil(archived) && esb.termQuery('archived', archived),
      ]),
    );

  private static createChatsSortFieldQuery = (sort: Nullable<SdkChatsSortT>, ids: TableUuid[]) => {
    switch (sort) {
      case 'favoritesFirst:createdAt:desc':
        return rejectFalsyItems([
          ids.length > 0 && createSortByIdsOrderScript(ids),
          ...createScoredSortFieldQuery('createdAt:desc'),
        ]);

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

  private static mapOutputHit = ({ summary, ...source }: ChatsEsDocument): SdkSearchChatItemT =>
    ({
      id: source.id,
      createdAt: source.created_at,
      updatedAt: source.updated_at,
      archived: source.archived,
      organization: source.organization,
      creator: source.creator,
      internal: source.internal,
      project: source.project,
      stats: source.stats,
      permissions: mapRawEsDocToSdkPermissions(source.permissions),
      apps: source.apps.map(app => ({
        id: app.id,
        aiExternalAPI: app.ai_external_api,
      })),
      summary: {
        content: {
          generated: summary.content.generated,
          value: summary.content.value,
          generatedAt: summary.content.generated_at,
        },
        name: {
          generated: summary.name.generated,
          value: summary.name.value,
          generatedAt: summary.name.generated_at,
        },
      },
    });
}
