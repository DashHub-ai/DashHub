import camelcaseKeys from 'camelcase-keys';
import esb from 'elastic-builder';
import { array as A, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import type {
  SdkSearchUserItemT,
  SdKSearchUsersInputT,
} from '@llm/sdk';

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

  search = (dto: SdKSearchUsersInputT) =>
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

  private static createEsRequestSearchBody = (dto: SdKSearchUsersInputT) =>
    createPaginationOffsetSearchQuery(dto)
      .query(UsersEsSearchRepo.createEsRequestSearchFilters(dto))
      .sorts(createScoredSortFieldQuery(dto.sort));

  private static createEsRequestSearchFilters = (
    {
      phrase,
      ids,
      archived,
    }: SdKSearchUsersInputT,
  ): esb.Query =>
    esb.boolQuery().must(
      rejectFalsyItems([
        !!ids?.length && esb.termsQuery('id', ids),
        !!phrase && createPhraseFieldQuery('email')(phrase),
        !isNil(archived) && esb.termQuery('archived', archived),
      ]),
    );

  private static mapOutputHit = (source: UsersEsDocument): SdkSearchUserItemT =>
    camelcaseKeys(source, {
      deep: true,
    }) as unknown as any;
}
