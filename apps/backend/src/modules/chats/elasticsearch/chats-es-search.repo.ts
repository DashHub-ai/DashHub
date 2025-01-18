import esb from 'elastic-builder';
import { array as A, taskEither as TE } from 'fp-ts';
import { flow, pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import type {
  SdkSearchChatItemT,
  SdkSearchChatsInputT,
} from '@llm/sdk';

import { isNil, pluck, rejectFalsyItems } from '@llm/commons';
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
  type ChatsEsDocument,
  ChatsEsIndexRepo,
} from './chats-es-index.repo';

type EsChatsInternalFilters = WithPermissionsInternalFilters<SdkSearchChatsInputT>;

@injectable()
export class ChatsEsSearchRepo {
  constructor(
    @inject(ChatsEsIndexRepo) private readonly indexRepo: ChatsEsIndexRepo,
  ) {}

  get = flow(
    this.indexRepo.getDocument,
    TE.map(ChatsEsSearchRepo.mapOutputHit),
  );

  search = (dto: EsChatsInternalFilters) => pipe(
    this.indexRepo.search(
      ChatsEsSearchRepo.createEsRequestSearchBody(dto).toJSON(),
    ),
    TE.map(({ hits: { total, hits } }) => ({
      items: pipe(
        hits,
        pluck('_source'),
        A.map(item => ChatsEsSearchRepo.mapOutputHit(item as ChatsEsDocument)),
      ),
      total: total.value,
    })),
  );

  private static createEsRequestSearchBody = (dto: SdkSearchChatsInputT) =>
    createPaginationOffsetSearchQuery(dto)
      .query(ChatsEsSearchRepo.createEsRequestSearchFilters(dto))
      .sorts(createScoredSortFieldQuery(dto.sort));

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
    }: EsChatsInternalFilters,
  ): esb.Query =>
    esb.boolQuery().must(
      rejectFalsyItems([
        esb.termsQuery('internal', false),
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
