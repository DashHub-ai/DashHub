import esb from 'elastic-builder';
import { array as A, taskEither as TE } from 'fp-ts';
import { flow, pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import type {
  SdkSearchUsersGroupItemT,
  SdkSearchUsersGroupsInputT,
  SdkSearchUsersGroupsOutputT,
} from '@llm/sdk';

import { isNil, pluck, rejectFalsyItems } from '@llm/commons';
import {
  createPaginationOffsetSearchQuery,
  createPhraseFieldQuery,
  createScoredSortFieldQuery,
} from '~/modules/elasticsearch';

import {
  type UsersGroupsEsDocument,
  UsersGroupsEsIndexRepo,
} from './users-groups-es-index.repo';

@injectable()
export class UsersGroupsEsSearchRepo {
  constructor(
    @inject(UsersGroupsEsIndexRepo) private readonly indexRepo: UsersGroupsEsIndexRepo,
  ) {}

  get = flow(
    this.indexRepo.getDocument,
    TE.map(UsersGroupsEsSearchRepo.mapOutputHit),
  );

  search = (dto: SdkSearchUsersGroupsInputT) => pipe(
    this.indexRepo.search(
      UsersGroupsEsSearchRepo.createEsRequestSearchBody(dto).toJSON(),
    ),
    TE.map(({ hits: { total, hits } }): SdkSearchUsersGroupsOutputT => ({
      items: pipe(
        hits,
        pluck('_source'),
        A.map(item => UsersGroupsEsSearchRepo.mapOutputHit(item as UsersGroupsEsDocument)),
      ),
      total: total.value,
    })),
  );

  private static createEsRequestSearchFilters = (
    {
      phrase,
      ids,
      excludeIds,
      organizationIds,
      usersIds,
      archived,
    }: SdkSearchUsersGroupsInputT,
  ): esb.Query =>
    esb.boolQuery().must(
      rejectFalsyItems([
        !!phrase && createPhraseFieldQuery()(phrase).boost(3),
        !!ids?.length && esb.termsQuery('id', ids),
        !!excludeIds?.length && esb.boolQuery().mustNot(esb.termsQuery('id', excludeIds)),
        !!organizationIds?.length && esb.termsQuery('organization.id', organizationIds),
        !!usersIds?.length && esb.nestedQuery(esb.termsQuery('users.id', usersIds), 'users'),
        !isNil(archived) && esb.termQuery('archived', archived),
      ]),
    );

  private static createEsRequestSearchBody = (dto: SdkSearchUsersGroupsInputT) =>
    createPaginationOffsetSearchQuery(dto)
      .query(UsersGroupsEsSearchRepo.createEsRequestSearchFilters(dto))
      .sorts(createScoredSortFieldQuery(dto.sort));

  private static mapOutputHit = (source: UsersGroupsEsDocument): SdkSearchUsersGroupItemT =>
    ({
      id: source.id,
      name: source.name,
      createdAt: source.created_at,
      updatedAt: source.updated_at,
      archived: source.archived,
      organization: source.organization,
      creator: source.creator,
      users: source.users,
    });
}
