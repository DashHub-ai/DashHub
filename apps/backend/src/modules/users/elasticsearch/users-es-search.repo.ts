import camelcaseKeys from 'camelcase-keys';
import esb from 'elastic-builder';
import { array as A, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import type {
  SdkSearchUserItemT,
  SdkSearchUsersInputT,
} from '@llm/sdk';
import type { TableId } from '~/modules/database';

import { isNil, pluck, rejectFalsyItems } from '@llm/commons';
import {
  createPaginationOffsetSearchQuery,
  createPhraseFieldQuery,
  createScoredSortFieldQuery,
} from '~/modules/elasticsearch';

import {
  type UsersEsDocument,
  UsersEsIndexRepo,
} from './users-es-index.repo';

@injectable()
export class UsersEsSearchRepo {
  constructor(
    @inject(UsersEsIndexRepo) private readonly indexRepo: UsersEsIndexRepo,
  ) {}

  get = (id: TableId) =>
    pipe(
      this.indexRepo.getDocument(id),
      TE.map(UsersEsSearchRepo.mapOutputHit),
    );

  search = (dto: SdkSearchUsersInputT) =>
    pipe(
      this.indexRepo.search(
        UsersEsSearchRepo.createEsRequestSearchBody(dto).toJSON(),
      ),
      TE.map(({ hits: { total, hits } }) => ({
        items: pipe(
          hits,
          pluck('_source'),
          A.map(item => UsersEsSearchRepo.mapOutputHit(item as UsersEsDocument)),
        ),
        total: total.value,
      })),
    );

  private static createEsRequestSearchBody = (dto: SdkSearchUsersInputT) =>
    createPaginationOffsetSearchQuery(dto)
      .query(UsersEsSearchRepo.createEsRequestSearchFilters(dto))
      .sorts(createScoredSortFieldQuery(dto.sort));

  private static createEsRequestSearchFilters = (
    {
      phrase,
      ids,
      organizationIds,
      archived,
    }: SdkSearchUsersInputT,
  ): esb.Query =>
    esb.boolQuery().must(
      rejectFalsyItems([
        !!ids?.length && esb.termsQuery('id', ids),
        !!organizationIds?.length && esb.termsQuery('organization.id', organizationIds),
        !!phrase && (
          esb
            .boolQuery()
            .should([
              createPhraseFieldQuery()(phrase).boost(3),
              createPhraseFieldQuery('email')(phrase).boost(1.5),
            ])
            .minimumShouldMatch(1)
        ),
        !isNil(archived) && esb.termQuery('archived', archived),
      ]),
    );

  private static mapOutputHit = (source: UsersEsDocument): SdkSearchUserItemT =>
    camelcaseKeys(source, {
      deep: true,
    }) as unknown as any;
}
